var Specimen = require('../models/specimen.js')

exports.getSpecimen = async function(request, reply){
  let specimen_id = request.params['id']
  let specimen = Specimen.getSpecimen(specimen_id)
  reply.send(specimen)
}

exports.updateSpecimen = async function(request, reply){
  let specimen_id = request.params['id']
  let image = request.body['image']
  let specimen = Specimen.getSpecimen(specimen_id)
  if(specimen.ich_id == request.ich_id){
    specimen = Specimen.updateSpecimen(specimen_id, image)
    reply.code(204).send(specimen)
  }else{
    reply.code(403).send('Cannot modify images you did not create')
  }
}
