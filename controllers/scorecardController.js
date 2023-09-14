var Scorecard = require('../models/scorecard.js')

exports.addScorecard = async function(request, reply){
  let template_id = request.body['template_id']
  let ich_id = request.ich_id
  let spam_filter_id = request.body['spam_filter_id']
  let whitelisted = request.body['whitelisted']
  let stars = request.body['stars']
  let notes = request.body['notes']
  let number_of_targets = request.body['number_of_targets']
  let number_of_clicks = request.body['number_of_clicks']
  let new_scorecard = Scorecard.addScorecard(template_id, ich_id, spam_filter_id, whitelisted, stars, notes, number_of_targets, number_of_clicks)
  reply.code(201).send(new_scorecard)
}

exports.getScorecards = async function(request, reply){
  let template_id = request.params['template_id']
  let scorecards = Scorecard.getScorecards(template_id)
  reply.send(scorecards)
}

exports.deleteScorecard = async function(request, reply){
  let scorecard_id = request.params['id']
  let ich_id = request.ich_id
  let scorecard = Scorecard.getScorecard(scorecard_id)
  if(scorecard.ich_id == request.ich_id){
    let changes = Scorecard.deleteScorecard(scorecard_id)
    reply.code(200).send(changes)
  }else{
    reply.code(403).send('Cannot delete scorecards your did not create')
  }
}
