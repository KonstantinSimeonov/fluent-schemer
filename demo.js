"use strict";
exports.__esModule = true;
var create_instance_1 = require("./lib/create-instance");
var age = create_instance_1.number().integer().min(10).required();
var name = create_instance_1.string().minlength(5).maxlength(10).required();
var stuff = create_instance_1.object({
    birthDate: create_instance_1.date().after('1/1/2017').required(),
    name: name,
    age: age
}).required();
