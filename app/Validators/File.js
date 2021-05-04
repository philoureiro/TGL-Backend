"use strict";

class File {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      // validation rules
      file: "required|unique:files",
      name: "required",
      type: "required",
      subtype: "required",
    };
  }
}

module.exports = File;
