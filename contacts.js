const fs = require("fs");
const path = require("path");
const nanoid = require("nanoid");
const contactsPath = path.resolve("db", "contacts.json");

function listContacts() {
  fs.readFile(contactsPath, "utf8", (error, contactList) => {
    error ? console.error(error.message) : console.table(contactList);
  });
}

function getContactById(contactId) {
  fs.readFile(contactsPath, "utf8", (error, contactList) => {
    contactList = JSON.parse(contactList);

    const foundContact = contactList.find(
      (contact) => contact.id === contactId
    );
    error ? console.error(error.message) : console.log(foundContact);
  });
}

function removeContact(contactId) {
  fs.readFile(contactsPath, "utf8", (error, contactList) => {
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
const readableStream = fs.createReadStream(contactsPath, "utf8");
const writableStream = fs.createWriteStream(contactsPath);
function addContact(name, email, phone) {
  readableStream.on("data", () => {
    // console.log(chunk);
    console.log(name, email, phone);
    const y = JSON.stringify(name, null, 2);
    writableStream.write(y);
  });

  writableStream.end();
  //   contactList = JSON.parse(contactList)
  //   .push({
  //     id: nanoid(),
  //     name,
  //     email,
  //     phone,
  //   });

  //   fs.writeFile(contactsPath, JSON.stringify(contactList, null, 2), (error) => {
  //     if (error) console.error(error.message);
  //     return;
  //   });
}

module.exports = { listContacts, getContactById, removeContact, addContact };
