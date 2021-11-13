class ApiFeatures {
  constructor(model, queryReq) {
    this.query = model;
    this.queryReq = queryReq;
  }

  filter() {
    this.query = this.query.find(this.queryReq);
    return this;
  }

  //TODO: ADD SORT, PAGINATION, FIELDS
}

module.exports = ApiFeatures;
