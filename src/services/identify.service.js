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
  const primaryIds = new Set();

  for (const contact of existingContacts) {
    if (contact.linkPrecedence === "primary") {
      primaryIds.add(contact._id.toString());
    } else {
      primaryIds.add(contact.linkedId.toString());
    }
  }
  let graph = await Contact.find({
    $or: [
      {
        _id: {
          $in: [...primaryIds],
        },
      },
      {
        linkedId: {
          $in: [...primaryIds],
        },
      },
    ],
  }).sort({ createdAt: 1 });

  const primaryContacts = graph.filter(
    (contact) => contact.linkPrecedence === "primary",
  );

  if (primaryContacts.length > 1) {
    primaryContacts.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    );

    const oldestPrimary = primaryContacts[0];

    for (let i = 1; i < primaryContacts.length; i++) {
      const currentPrimary = primaryContacts[i];

      // Convert current primary into secondary
      await Contact.findByIdAndUpdate(currentPrimary._id, {
        linkedId: oldestPrimary._id,
        linkPrecedence: "secondary",
      });

      // Move all children of current primary
      await Contact.updateMany(
        {
          linkedId: currentPrimary._id,
        },
        {
          linkedId: oldestPrimary._id,
        },
      );
    }

    // Refresh graph after merge
    graph = await Contact.find({
      $or: [{ _id: oldestPrimary._id }, { linkedId: oldestPrimary._id }],
    }).sort({ createdAt: 1 });
  }
  const primaryContact = graph.find(
    (contact) => contact.linkPrecedence === "primary",
  );

  const emailExists = graph.some((contact) => contact.email === email);

  const phoneExists = graph.some(
    (contact) => contact.phoneNumber === phoneNumber,
  );

  if (!emailExists || !phoneExists) {
    const secondaryContact = await Contact.create({
      email,
      phoneNumber,
      linkedId: primaryContact._id,
      linkPrecedence: "secondary",
    });

    // Refresh graph
    graph = await Contact.find({
      $or: [{ _id: primaryContact._id }, { linkedId: primaryContact._id }],
    });
  }
  // collect all unique emails
  const emails = [
    ...new Set(graph.map((contact) => contact.email).filter(Boolean)),
  ];
  // collect all unique phone number
  const phoneNumbers = [
    ...new Set(graph.map((contact) => contact.phoneNumber).filter(Boolean)),
  ];

  const secondaryContactIds = graph
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
