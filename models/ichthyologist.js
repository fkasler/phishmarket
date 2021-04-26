/** Class representing an approved technician. Each API key is hard coded in the config file. */

//create the ichthyologists table if it does not exist.
let ich_setup = db.prepare(`
  CREATE TABLE IF NOT EXISTS ichthyologists (
    ich_id INTEGER PRIMARY KEY,
    handle TEXT NOT NULL UNIQUE,
    api_key TEXT NOT NULL UNIQUE
  )`
);

ich_setup.run()

let user_setup = db.prepare(`
  INSERT OR IGNORE INTO ichthyologists(
    handle,
    api_key
  ) VALUES (
    $handle,
    $api_key
  )
`)

user_setup.run({"handle": 'ph3eds', "api_key": 'ballnout@thePhishmarket'})
user_setup.run({"handle": 'feedz', "api_key": 'ballnout@thePhishmarketz'})


/**
* @param {string} api_key - The API key of the technician. This route is used to authorize actions and apply ich_id attributes to other Templates, Scorecards, etc.
*/
exports.getIchthyologistIDByAPIKey = function(api_key){
  let get_ich = db.prepare(`
    SELECT ich_id FROM ichthyologists WHERE api_key = $api_key
  `).pluck()
  return get_ich.get({
    "api_key": api_key
  })
}
/**
* @param {number} ich_id - The ID of the user we want to get a handle for.
*/
exports.getIchthyologistHandleByID = function(ich_id){
  let get_ich = db.prepare(`
    SELECT handle FROM ichthyologists WHERE ich_id = $ich_id
  `)
  return get_ich.get({
    "ich_id": ich_id
  })
}
