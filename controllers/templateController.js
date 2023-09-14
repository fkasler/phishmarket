var Template = require('../models/template.js')
//var Specimen = require('../models/specimen.js')

exports.listTemplates = async function(request, reply){
  let filter = request.body['filter']
  let limit = request.body['limit']
  let offset = request.body['offset']
  let templates = Template.listTemplates(filter, limit, offset)
  reply.send(templates)
}

exports.getTemplate = async function(request, reply){
  let template_id = request.params['id']
  let template = Template.getTemplate(template_id)
  reply.code(200).send(template)
}

exports.getTemplateImage = async function(request, reply){
  let template_id = request.params['id']
  let template = Template.getTemplateImage(template_id)
  reply.code(200).send(template)
}

exports.addTemplate = async function(request, reply){
  let ich_id = request.ich_id
  let title = request.body['title']
  let short_description = request.body['short_description']
  let report_description = request.body['report_description']
  let mime_content = request.body['mime_content']
  let image = request.body['image']
  let new_template = Template.addTemplate(ich_id, title, short_description, report_description, mime_content, image)
  reply.code(201).send(new_template)
}

exports.updateTemplate = async function(request, reply){
  let template_id = request.params['id']
  let ich_id = request.ich_id
  let title = request.body['title']
  let short_description = request.body['short_description']
  let report_description = request.body['report_description']
  let mime_content = request.body['mime_content']
  let image = request.body['image']
  let template = Template.getTemplate(template_id)
  if(template.ich_id == request.ich_id){
    template = Template.updateTemplate(template_id, ich_id, title, short_description, report_description, mime_content, image)
    reply.code(204).send(template)
  }else{
    reply.code(403).send('Cannot modify templates your did not create')
  }
}

exports.deleteTemplate = async function(request, reply){
  let template_id = request.params['id']
  let ich_id = request.ich_id
  let template = Template.getTemplate(template_id)
  if(template.ich_id == request.ich_id){
    let changes = Template.deleteTemplate(template_id)
    reply.code(200).send(changes)
  }else{
    reply.code(403).send('Cannot delete templates your did not create')
  }
}
