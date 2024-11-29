const User = require("../model/user.model.js");

// Registration function with alerts
module.exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Create a new user instance with the provided username and mobile number
    const newUser = new User({ username });

    // Register the user using passport-local-mongoose
    await User.register(newUser, password);

    // Log in the user after registration
    req.logIn(newUser, (err) => {
      if (err) {
        console.error("Login error after registration:", err);
        return res
          .json({
            success: false,
            error: "Login failed after registration.",
          })
          .redirect("/");
      }
      res.redirect("/");
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.json({
      success: false,
      error: error.message || "Registration failed.",
    });
  }
};

// Login function with alerts
module.exports.signIn = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Authenticate using username and password
    User.authenticate()(username, password, (err, user, options) => {
      if (err || !user) {
        console.error("Authentication error:", err || options.message);
        return res.redirect("/");
      }

      // Log in the authenticated user
      req.logIn(user, (err) => {
        if (err) {
          console.error("Login error:", err);
          return next(err);
        }
        return res.redirect("/home");
      });
    });
  } catch (e) {
    res.send(e);
  }
};

// Logout function
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return next(err);
    }
    res.redirect("/"); // Redirect to the homepage after logging out
  });
};
