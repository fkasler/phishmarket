/**
* @param {string} image - The base64 encoded image of the email Template object as generated by Phishmonger's preview feature.
*/
exports.addSpecimen = function(template_id, ich_id, image){
  let add_specimen = db.prepare(`
    INSERT INTO specimens VALUES(
      $specimen_id,
      $template_id,
      $ich_id,
      $created_at,
      $image
    )
  `)
  return add_specimen.run({
    "specimen_id": null,
    "template_id": template_id,
    "ich_id": ich_id,
    "created_at": Date.now(),
    "image": image
  })
}
/**
* @param {number} specimen_id - The ID of the Specimen object to get.
*/
exports.getSpecimen = function(specimen_id){
  let get_specimen = db.prepare(`
    SELECT * FROM specimens WHERE specimen_id = $specimen_id
  `)
  return get_specimen.get({
    "specimen_id": specimen_id
  })
}
/**
* @param {number} specimen_id - The ID of the Specimen object we are updating.
* @param {string} image - The base64 encoded image of the email Template object as generated by Phishmonger's preview feature.
*/
exports.updateSpecimen = function(specimen_id, image){
  let update_specimen = db.prepare(`
    UPDATE specimens SET image = $image WHERE specimen_id = $specimen_id
  `)
  return update_specimen.run({
    "specimen_id": specimen_id,
    "image": image 
  })
}
/**
* @param {number} specimen_id - The ID of the Specimen object to delete.
*/
exports.deleteSpecimen = function(specimen_id){
}

