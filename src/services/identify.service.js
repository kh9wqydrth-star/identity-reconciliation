import { Contact } from "../model/contact.model.js";
export const identifyContact = async ({ email, phoneNumber }) => {
  console.log(email);
  console.log(phoneNumber);

  // Validation
  if (!email && !phoneNumber) {
    throw new Error("Either email or phoneNumber is required");
  }

  // Dynamic query
  const conditions = [];

  if (email) {
    conditions.push({ email });
  }

  if (phoneNumber) {
    conditions.push({ phoneNumber });
  }

  // Find existing contacts
  const existingContacts = await Contact.find({
    $or: conditions,
  });

  console.log(existingContacts);
  if (existingContacts.length === 0) {
    const newContact = await Contact.create({
      email,
      phoneNumber,
      linkPrecedence: "primary",
    });

    return {
      contact: {
        primaryContactId: newContact._id,
        emails: [newContact.email],
        phoneNumbers: [newContact.phoneNumber],
        secondaryContactIds: [],
      },
    };
  }
  // find primary contact
  const primaryContact =
    existingContacts.find((contact) => contact.linkPrecedence === "primary") ||
    existingContacts[0];

  const emailExists = existingContacts.some(
    (contact) => contact.email === email,
  );

  const phoneExists = existingContacts.some(
    (contact) => contact.phoneNumber === phoneNumber,
  );

  if (!emailExists || !phoneExists) {
    const secondaryContact = await Contact.create({
      email,
      phoneNumber,
      linkedId: primaryContact._id,
      linkPrecedence: "secondary",
    });

    existingContacts.push(secondaryContact);
  }
  // collect all unique emails
  const emails = [
    ...new Set(
      existingContacts.map((contact) => contact.email).filter(Boolean),
    ),
  ];
  // collect all unique phone number
  const phoneNumbers = [
    ...new Set(
      existingContacts.map((contact) => contact.phoneNumber).filter(Boolean),
    ),
  ];

  const secondaryContactIds = existingContacts
    .filter((contact) => contact.linkPrecedence === "secondary")
    .map((contact) => contact._id);

  return {
    contact: {
      primaryContactId: primaryContact._id,
      emails,
      phoneNumbers,
      secondaryContactIds,
    },
  };
};
