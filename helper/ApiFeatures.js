class ApiFeatures {
  constructor(model, queryReq) {
    this.query = model;
    this.queryReq = queryReq;
  }

  filter() {
    //advance filtering
    let queryString = JSON.stringify(this.queryReq);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }

  sort() {
    if (this.queryReq.sort) {
      const sortBy = this.queryReq.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    }
    return this;
  }

  pagination() {
    const page = this.queryReq.page * 1 || 1;
    const limit = this.queryReq.limit * 1 || 50;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  onlyFields() {
    if (this.queryReq.fields) {
      const fields = this.queryReq.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    }
    return this;
  }

  //TODO: RATING NILAI
}

module.exports = ApiFeatures;
