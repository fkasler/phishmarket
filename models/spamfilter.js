/**
 * Spam Filter module.
 * @module models/spamfilter
 */

/**
* @param {string} prouct_name - The name of the spam filter product. We keep these as SpamFilter objects in the tool to standardize their references and run metrics on the individual prouct.
* @param {number} ich_id - The ID of the user who added this SpamFilter object.
*/
exports.addSpamFilter = function(ich_id, product_name){
  let add_spam_filter = db.prepare(`
    INSERT INTO spamfilters VALUES(
      $spam_filter_id,
      $ich_id,
      $created_at,
      $product_name
    )
  `)
  return add_spam_filter.run({
    "spam_filter_id": null,
    "ich_id": ich_id,
    "created_at": Date.now(),
    "product_name": product_name
  })
}
exports.listSpamFilters = function(){
  list_filters = db.prepare(`SELECT spam_filter_id, product_name FROM spamfilters`)
  return list_filters.all()
}
