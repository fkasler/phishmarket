var SpamFilter = require('../models/SpamFilter.js')

exports.addSpamFilter = async function(request, reply){
  let product_name = request.body['product_name']
  let new_spamfilter = SpamFilter.addSpamFilter(request.ich_id, product_name)
  reply.send(new_spamfilter)
}

exports.listSpamFilters = async function(request, reply){
  let filters = SpamFilter.listSpamFilters()
  reply.send(filters)
}
