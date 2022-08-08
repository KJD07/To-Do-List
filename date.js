module.exports.getdate = function() {
  var day = new Date();
  var options = {
    weekday: "long",
    day: "numeric",
    year: "numeric"
  };
  var today = day.toLocaleDateString("en-US", options);
  return today;
}
