import React, { useState, useEffect } from "react";
import {
  Jumbotron,
  Container,
  Col,
  Form,
  Button,
  Card,
  CardColumns,
} from "react-bootstrap";
import Image from "react-bootstrap/Image";
import Auth from "../utils/auth";
import { SAVE_BOOK } from "../utils/mutations";
import { searchGoogleBooks } from "../utils/API";
import { saveBookIds, getSavedBookIds } from "../utils/localStorage";
import { useMutation } from "@apollo/client";
import LinesEllipsis from "react-lines-ellipsis";
const SearchBooks = () => {
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGoogleBooks(searchInput);

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      const { items } = await response.json();
      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ["No author to display"],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || "",
      }));

      setSearchedBooks(bookData);
      setSearchInput("");
    } catch (err) {
      console.error(err);
    }
  };
  const [savedBook, { error }] = useMutation(SAVE_BOOK);
  const handleSaveBook = async (searchedId) => {
    const bookToSave = searchedBooks.find((book) => searchedId === book.bookId);

    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) {
      return false;
    }

    try {
      const book = await savedBook({
        variables: { book: bookToSave },
      });

      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Jumbotron fluid className="search-panel  ">
        <Container>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  className="mb-3"
                  size="lg"
                  placeholder="Enter Author Name or Book Title"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="primary" size="lg">
                  <i className="fa-solid fa-magnifying-glass"></i> Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h4 className="mb-3">
          {searchedBooks.length
            ? `Total ${searchedBooks.length} results found`
            : ""}
        </h4>
        <CardColumns>
          {searchedBooks.map((book) => {
            var description = book.description;

            //description=  description.length ;
            return (
              <Card
                key={book.bookId}
                className="shadow p-3 mb-5 bg-white rounded"
              >
                {book.image ? (
                  <Image
                    className="mt-3 rounded mx-auto d-block"
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>
                    {" "}
                    <LinesEllipsis
                      text={book.title}
                      maxLine="1"
                      ellipsis="..."
                      trimRight
                      basedOn="letters"
                    />
                  </Card.Title>

                  <p className="small">Authors: {book.authors}</p>
                  <LinesEllipsis
                    text={description}
                    maxLine="3"
                    ellipsis="..."
                    trimRight
                    basedOn="letters"
                  />

                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedBookIds?.some(
                        (savedBookId) => savedBookId === book.bookId
                      )}
                      className="btn-block btn-success"
                      onClick={() => handleSaveBook(book.bookId)}
                    >
                      <i className="fa-solid fa-floppy-disk"></i>
                      {savedBookIds?.some(
                        (savedBookId) => savedBookId === book.bookId
                      )
                        ? " This book has already been saved!"
                        : " Save Book"}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
        {error && (
          <div className="my-3 p-3 bg-danger text-white">{error.message}</div>
        )}
      </Container>
    </>
  );
};

export default SearchBooks;
