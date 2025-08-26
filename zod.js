const z = require("zod"); 
 
const signupschema = z.object({ 
  email: z.string(),
  username: z.string(),
  password: z.string()
});

const signinschema = z.object({ 
  email: z.string(),
  password: z.string()
});

module.exports = { signupschema, signinschema };