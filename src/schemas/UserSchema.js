const userSchema = {
  type: "object",
  required: ["username", "email", "age"],
  properties: {
    username: { type: "string", minLength: 3, maxLength: 30 },
    email: { type: "string" },
    age: { type: "integer", minimum: 18 },
  },
};

module.exports = { userSchema };
