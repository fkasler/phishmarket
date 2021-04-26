var Ichthyologist = require('../models/ichthyologist.js')

exports.getIchthyologistHandleByID = async function(request, reply){
  let id = request.params['id']
  let user = Ichthyologist.getIchthyologistHandleByID(id)
  reply.send(user)
}

exports.getIchthyologistIDByAPIKey = function(api_key){
  let ich_id = Ichthyologist.getIchthyologistIDByAPIKey(api_key)
  return ich_id
}
