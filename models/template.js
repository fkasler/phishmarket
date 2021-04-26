/**
* @param {object} filter - A JSON key:value pair hash of search filters we would like to apply to our search. Blank/undefined/null will return all templates.
* @param {number} limit - The number of search results to return. Useful for pagination.
* @param {number} offset - The number of search results to skip. Useful for pagination.
*/
exports.listTemplates = function(filter, limit, offset){
  let list_templates = db.prepare(`
    SELECT template_id, ich_id, created_at, title, short_description FROM templates WHERE
      ich_id LIKE $ich_id AND
      title LIKE $title AND
      short_description LIKE $short_description
      LIMIT $limit OFFSET $offset
  `)
  return list_templates.all({
    "ich_id": `%${filter.ich_id}%`,
    "title": `%${filter.title}%`,
    "short_description": `%${filter.short_description}%`,
    "limit": limit,
    "offset": offset
  })
}
/**
* @param {number} tempate_id - The ID for the template that we want to retrieve.
*/
exports.getTemplate = function(template_id){
  let get_template = db.prepare(`
    SELECT * FROM templates WHERE template_id = $template_id
  `)
  return get_template.get({
    "template_id": template_id
  })
}
/**
* @param {number} tempate_id - The ID for the template that we want to retrieve.
*/
exports.getTemplateImage = function(template_id){
  let get_template = db.prepare(`
    SELECT image FROM templates WHERE template_id = $template_id
  `)
  return get_template.get({
    "template_id": template_id
  })
}
/**
* @param {string} title - The name of the template. A simple name for this phishing scenario.
* @param {number} ich_id - The ID of the user who published the scenario. This is infered from the user's API key.
* @param {string} short_description - A layman's description of the scenario/template for quick searches.
* @param {string} report_description - Boilerplate description of the scenario in professional writing to help automate reporting.
* @param {string} mime_content - The template itself. This is the SMTP DATA of the email, as captured and modified by Phishmonger.
* @param {string} image - Base64 encoded preview image of the template
*/
exports.addTemplate = function(ich_id, title, short_description, report_description, mime_content, image){
  let add_template = db.prepare(`
    INSERT INTO templates VALUES(
      $template_id,
      $ich_id,
      $created_at,
      $title,
      $short_description,
      $report_description,
      $mime_content,
      $image
    )
  `)
  return add_template.run({
    "template_id": null,
    "ich_id": ich_id,
    "created_at": Date.now(),
    "title": title,
    "short_description": short_description,
    "report_description": report_description,
    "mime_content": mime_content,
    "image": image
  })
}
/**
* @param {number} template_id - The ID of the template object we are updating.
* @param {string} title - The name of the template. A simple name for this phishing scenario.
* @param {string} short_description - A layman's description of the scenario/template for quick searches.
* @param {string} report_description - Boilerplate description of the scenario in professional writing to help automate reporting.
* @param {string} mime_content - The template itself. This is the SMTP DATA of the email, as captured and modified by Phishmonger.
* @param {string} specimen - A base64 encoded screenshot of the scenario, as generated by Phishmonger's preview feature. 
*/
exports.updateTemplate = function(template_id, ich_id, title, short_description, report_description, mime_content, image){
  let update_template = db.prepare(`
    UPDATE templates SET
      ich_id = $ich_id,
      title = $title,
      short_description = $short_description,
      report_description = $report_description,
      mime_content = $mime_content,
      image = $image
    WHERE
      template_id = $template_id
  `)
  return update_template.run({
    "ich_id": ich_id,
    "created_at": Date.now(),
    "title": title,
    "short_description": short_description,
    "report_description": report_description,
    "mime_content": mime_content,
    "image": image,
    "template_id": template_id
  })
}
/**
* @param {number} template_id - The ID of the template object we are deleting.
*/
exports.deleteTemplate = function(template_id){
  let delete_template = db.prepare(`
    DELETE FROM templates WHERE template_id = $template_id
  `)
  return delete_template.run({
    "template_id": template_id
  })
}
