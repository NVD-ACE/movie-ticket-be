// export const validateUserId = (req, res, next) => {
//     const { id } = req.params;
//     if (!id || isNaN(id)) {
//         return res.status(400).json({ message: "Invalid user ID" });
//     }
//     next();
// }
export const validateUpdateUser = [
  body('username').optional().isLength({ min: 3 }).trim(),
  body('email').optional().isEmail().normalizeEmail(),
  body('password').optional().isLength({ min: 6 }),
];