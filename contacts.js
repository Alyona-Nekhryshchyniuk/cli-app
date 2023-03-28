const fs = require("fs");
const path = require("path");
const { nanoid } = require("nanoid");
const { Transform } = require("stream");

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

const streamPath = path.resolve("db", "stream.json");
const readStream = fs.createReadStream(contactsPath, "utf8");
const writeStream = fs.createWriteStream(streamPath);

// Tranform stream to combine readstream(new contact credentials) adn writestream (add new contact object to contacts array)
class addNewContact extends Transform {
  constructor(name, email, phone) {
    super();
    this.name = name;
    this.email = email;
    this.phone = phone;
  }

  _transform(bufferChunk, encoding, callback) {
    const parsed = JSON.parse(bufferChunk.toString());
    const listWithNewContact = [
      ...parsed,
      { id: nanoid(), name: this.name, email: this.email, phone: this.phone },
    ];
    const jsonList = JSON.stringify(listWithNewContact, null, 2);

    this.push(jsonList);
    callback();
  }
}

// _____________________________________________________________________________________________________

function addContact(name, email, phone) {
  // xStream - stream for transforming readable stream
  const xStream = new addNewContact(name, email, phone);

  //   combine streams
  readStream
    .pipe(xStream)
    .pipe(writeStream)
    .on("finish", () => {
      console.log("Finished");
    });
}

module.exports = { listContacts, getContactById, removeContact, addContact };
