const fs = require("fs");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.resolve("json", "contacts.json");

function listContacts() {
  fs.readFile(contactsPath, (error, contactList) => {
    error
      ? console.error(error.message)
      : console.table(JSON.parse(contactList));
  });
}

function getContactById(contactId) {
  fs.readFile(contactsPath, (error, contactList) => {
    contactList = JSON.parse(contactList);

    const foundContact = contactList.find(
      (contact) => contact.id === contactId
    );
    error ? console.error(error.message) : console.log(foundContact);
  });
}

function removeContact(contactId) {
  fs.readFile(contactsPath, (error, contactList) => {
    contactList = JSON.parse(contactList);

    const foundContact = contactList.find(
      (contact) => contact.id === contactId
    );
    const indexOfFoundContactById = contactList.findIndex(
      (oneOfconts) => oneOfconts === foundContact
    );
    if (indexOfFoundContactById > 0) {
      const deletedContact = contactList.splice(indexOfFoundContactById, 1);
      fs.writeFile(
        contactsPath,
        JSON.stringify(contactList, null, 2),
        (error) => {
          return error
            ? console.error(error.message)
            : console.log(deletedContact);
        }
      );

      return;
    }
    console.log(`No contact with id: ${contactId}.`);
  });
}

function addContact(name, email, phone) {
  fs.readFile(contactsPath, (error, contactList) => {
    const parsedList = JSON.parse(contactList);
    const listWithNewContact = [
      ...parsedList,
      { id: nanoid(), name, email, phone },
    ];

    fs.writeFile(
      contactsPath,
      JSON.stringify(listWithNewContact, null, 2),
      (error) => {
        return error
          ? console.error(error.message)
          : console.table(listWithNewContact);
      }
    );
  });
}

module.exports = { listContacts, getContactById, removeContact, addContact };
