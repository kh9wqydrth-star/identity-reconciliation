import { identifyContact } from "../services/identify.service.js";

export const identify = async (req, res) => {
  try {
    const result = await identifyContact(req.body);

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};
