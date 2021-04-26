const fastify = require('fastify')({ logger: true })
fastify.register(require('fastify-cookie'))
const db = require('./database.js')
// Import Swagger Options
const swagger = require('./config/swagger')

//Allow JS to set Bearer token
fastify.register(require('fastify-cors'), { 
  "allowedHeaders": 'Content-Type,Authorization'
})

// Register Swagger
//fastify.register(require('fastify-swagger'), swagger.options)
//New Open API Standard
fastify.register(require('fastify-oas'), swagger.options)


var IchthyologistController = require('./controllers/ichthyologistController.js')
//add an ichthyologist ID to each req object for reference in various API calls
fastify.decorateRequest('ich_id', '')
//add some simple custom auth logic
fastify.addHook('preHandler', (req, reply, done) => {
  if(req.url.includes('documentation')){
    done()
  }else{
    const bearerType = 'Bearer'
    const header = req.raw.headers.authorization
    if (!header) {
      reply.code(401).send('Not Authorized')
      done()
    }
    const api_key = header.substring(bearerType.length).trim()
    req.ich_id = IchthyologistController.getIchthyologistIDByAPIKey(api_key)
    if(req.ich_id == undefined){
      reply.code(401).send('Not Authorized')
      done()
    }else{
      done()
    }
  }
})

fastify.route({
  method: 'GET',
  url: '/user/:id',
  schema: {
    security: [{bearerAuth: []}],
    description: 'Get username for a ich_id',
    tags: ['User'],
    summary: 'username per id',
    params: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'user id'
        }
      }
    },
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          handle: { type: 'string' }
        }
      }
    }
  },
  handler: IchthyologistController.getIchthyologistHandleByID
})

var TemplateController = require('./controllers/templateController.js')
fastify.route({
  method: 'GET',
  url: '/template/:id',
  schema: {
    security: [{bearerAuth: []}],
    description: 'Get a full template object from its ID',
    tags: ['Template'],
    summary: 'get template',
    params: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'template id'
        }
      }
    },
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          template_id: {
            type: 'number',
            description: 'ID for the template'
          },
          ich_id: {
            type: 'number',
            description: 'ID for the user who created the template'
          },
          created_at: {
            type: 'number',
            description: 'epoch timestamp of when the template was created'
          },
          title: {
            type: 'string',
            description: 'Unique title for the template'
          },
          short_description: {
            type: 'string',
            description: 'Basic description of this email template'
          },
          report_description: {
            type: 'string',
            description: 'Professional language description of the template for reporting'
          },
          mime_content: {
            type: 'string',
            description: 'The template content itself'
          }
        }
      }
    }
  },
  handler: TemplateController.getTemplate
})

fastify.route({
  method: 'GET',
  url: '/template/:id/image',
  schema: {
    security: [{bearerAuth: []}],
    description: 'Get an image for a template',
    tags: ['Template'],
    summary: 'get template image',
    params: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'template id'
        }
      }
    },
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          image: {
            type: 'string',
            description: 'Base64 encoded image'
          }
        }
      }
    }
  },
  handler: TemplateController.getTemplateImage
})

fastify.route({
  method: 'POST',
  url: '/template/add',
  schema: {
    security: [{bearerAuth: []}],
    description: 'Add a new template',
    tags: ['Template'],
    summary: 'add template',
    body: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Unique title for the template'
        },
        short_description: {
          type: 'string',
          description: 'Basic description of this email template'
        },
        report_description: {
          type: 'string',
          description: 'Professional language description of the template for reporting'
        },
        mime_content: {
          type: 'string',
          description: 'The template content itself'
        },
        image: {
          type: 'string',
          description: 'base64 encoded preview image of the template'
        }
      }
    },
    response: {
      201: {
        description: 'Template Added',
        type: 'object',
        properties: {
          changes: {
            type: 'number'
          },
          lastInsertRowid: {
            type: 'number'
          }
        }
      }
    }
  },
  handler: TemplateController.addTemplate
})

fastify.route({
  method: 'POST',
  url: '/template/list',
  schema: {
    security: [{bearerAuth: []}],
    description: 'List templates based on filter and pagination',
    tags: ['Template'],
    summary: 'list templates',
    body: {
      type: 'object',
      properties: {
        filter: {
          type: 'object',
          description: 'Object of string filters we can apply to the search',
          properties: {
            ich_id: {
              type: 'string',
              description: 'ID for the user who created the template'
            },
            title: {
              type: 'string',
              description: 'Unique title for the template'
            },
            short_description: {
              type: 'string',
              description: 'Basic description of this email template'
            }
          }
        },
        limit: {
          type: 'number',
          description: 'How many results to return per page'
        },
        offset: {
          type: 'number',
          description: 'How many results to skip for pagination'
        }
      }
    },
    response: {
      200: {
        description: 'Successful response',
        type: 'array'
      }
    }
  },
  handler: TemplateController.listTemplates
})

fastify.route({
  method: 'PUT',
  url: '/template/:id',
  schema: {
    security: [{bearerAuth: []}],
    description: 'Update template object',
    tags: ['Template'],
    summary: 'update template',
    params: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'template id'
        }
      }
    },
    body: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Unique title for the template'
        },
        short_description: {
          type: 'string',
          description: 'Basic description of this email template'
        },
        report_description: {
          type: 'string',
          description: 'Professional language description of the template for reporting'
        },
        mime_content: {
          type: 'string',
          description: 'The template content itself'
        },
        image: {
          type: 'string',
          description: 'base64 encoded preview image of the template'
        }
      }
    },
    response: {
      200: {
        description: 'Successful response',
        type: 'object'
      }
    }
  },
  handler: TemplateController.updateTemplate
})

fastify.route({
  method: 'DELETE',
  url: '/template/:id',
  schema: {
    security: [{bearerAuth: []}],
    description: 'Delete a template',
    tags: ['Template'],
    summary: 'delete template',
    params: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'template id'
        }
      }
    },
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          changes: {
            type: 'number'
          },
          lastInsertRowid: {
            type: 'number'
          }
        }
      }
    }
  },
  handler: TemplateController.deleteTemplate
})

var SpamFilterController = require('./controllers/spamFilterController.js')
fastify.route({
  method: 'GET',
  url: '/spamfilters',
  schema: {
    security: [{bearerAuth: []}],
    description: 'List all spam filter products in the database',
    tags: ['Spam Filter'],
    summary: 'list spam filters',
    response: {
      200: {
        description: 'Successful response',
        type: 'array'
      }
    }
  },
  handler: SpamFilterController.listSpamFilters
})

fastify.route({
  method: 'POST',
  url: '/spamfilter/add',
  schema: {
    security: [{bearerAuth: []}],
    description: 'Add a new spam filter product',
    tags: ['Spam Filter'],
    summary: 'add a new spam filter',
    body: {
      type: 'object',
      properties: {
        product_name: {
          type: 'string',
          description: 'spam filter product name'
        }
      }
    },
    response: {
      201: {
        description: 'Successful response',
        type: 'object'
      }
    }
  },
  handler: SpamFilterController.addSpamFilter
})

var ScorecardController = require('./controllers/scorecardController.js')
fastify.route({
  method: 'POST',
  url: '/scorecard/add',
  schema: {
    security: [{bearerAuth: []}],
    description: 'Add a new scorecard for a campaign',
    tags: ['Scorecard'],
    summary: 'add a new scorecard',
    body: {
      type: 'object',
      properties: {
        template_id: {
          type: 'number',
          description: 'tempate id'
        },
        spam_filter_id: {
          type: 'number',
          description: 'spam filter id'
        },
        whitelisted: {
          type: 'number',
          description: 'whitelisted (boolean)'
        },
        stars: {
          type: 'number',
          description: 'star rating (1-5)'
        },
        notes: {
          type: 'string',
          description: 'notes for other team mates'
        },
        number_of_targets: {
          type: 'number',
          description: 'number of tageted users'
        },
        number_of_clicks: {
          type: 'number',
          description: 'number of unique clicks for this campaign'
        }
      }
    },
    response: {
      201: {
        description: 'Successful response',
        type: 'object',
        properties: {
          changes: {
            type: 'number'
          },
          lastInsertRowid: {
            type: 'number'
          }
        }
      }
    }
  },
  handler: ScorecardController.addScorecard
})

fastify.route({
  method: 'GET',
  url: '/scorecard/list/:template_id',
  schema: {
    security: [{bearerAuth: []}],
    description: 'Get scorecards for a template',
    tags: ['Scorecard'],
    summary: 'get scorecards by template ID',
    params: {
      type: 'object',
      properties: {
        template_id: {
          type: 'string',
          description: 'template id'
        }
      }
    },
    response: {
      200: {
        description: 'Successful response',
        type: 'array'
      }
    }
  },
  handler: ScorecardController.getScorecards
})

fastify.route({
  method: 'DELETE',
  url: '/scorecard/:id',
  schema: {
    security: [{bearerAuth: []}],
    description: 'Delete a scorecard',
    tags: ['Scorecard'],
    summary: 'delete scorecard',
    params: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'scorecard id'
        }
      }
    },
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          changes: {
            type: 'number'
          },
          lastInsertRowid: {
            type: 'number'
          }
        }
      }
    }
  },
  handler: ScorecardController.deleteScorecard
})

// Run the server!
const start = async () => {
  fastify.listen(8000, (err) => {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
  })
}
start()


