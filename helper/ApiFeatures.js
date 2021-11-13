class ApiFeatures {
  constructor(model, queryReq) {
    this.query = model;
    this.queryReq = queryReq;
  }

  filter() {
    this.query = this.query.find(this.queryReq);
    return this;
  }
}

module.exports = ApiFeatures;
