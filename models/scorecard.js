/**
 * Scorecard module.
 * @module models/scorecard
 */

/**
* @param {number} template_id - The ID of the template the phishing email was build from.
* @param {number} ich_id - The ID of the user who is submitting the Scorecard. This is infered from the user's API key.
* @param {(number|string)} spam_filter_id - The spam filter that the technician sent the phishing email to/through. If an number, then it is the ID of an existing SpamFilter object. If a string, we add a new SpamFilter to track.
* @param {boolean} whitelisted - Did the technician need the client to whitelist this email phishing template? 0 for NO, 1 for YES.
* @param {number} stars - How did the technician rate the scenario on a scale of 1 to 5? Helps to rank templates and give kudos to awesome technicians.
* @param {string} notes - Notes for the technician to provide relevant data/help/suggestions/clarifications to other technicians.
* @param {number} number_of_targets - The number of users targeted in this campagin.
* @param {number} number_of_clicks - The number of unique clicks in this campaign. We focus on throughput for the template itself and its ability to generate interaction.
*/
exports.addScorecard = function(template_id, ich_id, spam_filter_id, whitelisted, stars, notes, number_of_targets, number_of_clicks){
  let add_template = db.prepare(`
    INSERT INTO scorecards VALUES(
      $scorecard_id,
      $template_id,
      $ich_id,
      $spam_filter_id,
      $created_at,
      $whitelisted,
      $stars,
      $notes,
      $number_of_targets,
      $number_of_clicks
    )
  `)
  return add_template.run({
    "scorecard_id": null,
    "template_id": template_id,
    "ich_id": ich_id,
    "spam_filter_id": spam_filter_id,
    "created_at": Date.now(),
    "whitelisted": whitelisted,
    "stars": stars,
    "notes": notes,
    "number_of_targets": number_of_targets,
    "number_of_clicks": number_of_clicks
  })
}
/**
* @param {number} scorecard_id - The ID of the Scorecard object we are getting.
*/
exports.getScorecard = function(scorecard_id){
  let get_scorecard = db.prepare(`
    SELECT * from scorecards WHERE scorecard_id = $scorecard_id
  `)
  return get_scorecard.get({
    "scorecard_id": scorecard_id
  })
}

/**
* @param {number} template_id - The ID of the Template object we are getting Scorecard object for.
*/
exports.getScorecards = function(template_id){
  let get_scorecards = db.prepare(`
    SELECT * from scorecards WHERE template_id = $template_id
  `)
  return get_scorecards.all({
    "template_id": template_id
  })
}
/**
* @param {number} scorecard_id - The ID of the Scorecard object to delete.
*/
exports.deleteScorecard = function(scorecard_id){
  let delete_scorecard = db.prepare(`
    DELETE FROM scorecards WHERE scorecard_id = $scorecard_id
  `)
  return delete_scorecard.run({
    "scorecard_id": scorecard_id
  })
}
