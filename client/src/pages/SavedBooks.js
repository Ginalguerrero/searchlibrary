import React from 'react';
import {
	Jumbotron,
	Container,
	CardColumns,
	Card,
	Button,
} from 'react-bootstrap';
import { DELETE_BOOK } from '../utils/mutations';
import { QUERY_ME } from '../utils/queries';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { useQuery, useMutation } from '@apollo/client';
import LinesEllipsis from 'react-lines-ellipsis'
import Image from 'react-bootstrap/Image'
const SavedBooks = () => {
	const { loading, data } = useQuery(QUERY_ME, {fetchPolicy: "no-cache"});
	const savedBooks = data?.me.savedBooks || [];

	const [deleteBook] = useMutation(DELETE_BOOK);
	const handleDeleteBook = async (bookId) => {
		const token = Auth.loggedIn() ? Auth.getToken() : null;
		if (!token) {
			return false;
		}

		try {
			await deleteBook({
				variables: { bookId },
			});
			removeBookId(bookId);
			window.location.reload();
		} catch (err) {
			console.error(err);
		}
	};

	if (loading) {
		return <h2>LOADING...</h2>;
	}

	return (
		<>
			<Jumbotron fluid  className='search-panel' >
				<Container>
					<h2>{savedBooks.length
						? `Total ${savedBooks.length}  ${
								savedBooks.length === 1 ? 'record Found' : 'records found'
						  }`
						: 'No records found'}</h2>
				</Container>
			</Jumbotron>
			<Container>
				 
				<CardColumns>
					{savedBooks.map((book) => {
						var description=book.description
						return (
							<Card key={book.bookId} className="shadow p-3 mb-5 bg-white rounded">
								{book.image ? (
									<Image className="mt-3 rounded mx-auto d-block"  src={book.image} alt={`The cover for ${book.title}`} /> 
								) : null}
								<Card.Body>
									<Card.Title><LinesEllipsis
									text={book.title}
									maxLine='1'
									ellipsis='...'
									trimRight
									basedOn='letters'
									/></Card.Title>
									<p className="small">Authors: {book.authors}</p>
									<LinesEllipsis
										text={description}
										maxLine='3'
										ellipsis='...'
										trimRight
										basedOn='letters'
										/>
									<Button
										className="btn-block btn-danger"
										onClick={() => handleDeleteBook(book.bookId)}
									>
										<i className="fa-solid fa-trash"></i> Remove Book
									</Button>
								</Card.Body>
							</Card>
						);
					})}
				</CardColumns>
			</Container>
		</>
	);
};

export default SavedBooks;
