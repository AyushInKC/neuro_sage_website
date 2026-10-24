import React, { useEffect, useState } from 'react';
import { BookOpen, ExternalLink, Quote as QuoteIcon } from 'lucide-react';
import { libraryApi } from '../../services/api';
import { LibraryBook, Quote } from '../../types';
const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const LibraryPage: React.FC = () => {
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  useEffect(() => { libraryApi.list().then((r) => { setBooks(r.books); setQuotes(r.quotes); }).catch(console.error); }, []);
  return <div className="space-y-10">
    <header className="border-b border-sand/70 pb-6"><div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta/10 text-terracotta text-xs font-semibold"><BookOpen className="w-4 h-4" /> Library for the Mind</div><h1 className="font-serif text-4xl font-bold text-deepBrown mt-3">Library for the Mind</h1><p className="text-secondaryText mt-2">Books and thoughtful words to support your wellbeing.</p></header>
    {quotes.length > 0 && <section><h2 className="font-serif text-2xl font-bold text-deepBrown mb-4">Quotes</h2><div className="grid md:grid-cols-2 gap-4">{quotes.map((quote) => <blockquote key={quote._id} className="rounded-2xl border border-sand bg-cream/60 p-5"><QuoteIcon className="w-5 h-5 text-terracotta mb-3" /><p className="font-serif text-lg text-deepBrown">“{quote.text}”</p>{quote.author && <cite className="block mt-2 text-xs text-secondaryText not-italic">— {quote.author}</cite>}</blockquote>)}</div></section>}
    <section><h2 className="font-serif text-2xl font-bold text-deepBrown mb-4">Books</h2>{books.length === 0 ? <p className="text-sm text-secondaryText">Books will be published here soon.</p> : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{books.map((book) => <article key={book.id} className="rounded-2xl overflow-hidden border border-sand bg-ivory"><img src={`${API_BASE.replace(/\/api$/, '')}${book.imageUrl}`} alt={book.bookName} className="w-full h-56 object-cover" /><div className="p-5"><h3 className="font-serif text-xl font-bold text-deepBrown">{book.bookName}</h3><p className="text-sm text-secondaryText mt-2">₹{book.price}</p><a href={book.buyLink} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-terracotta hover:underline">Buy the book <ExternalLink className="w-4 h-4" /></a></div></article>)}</div>}</section>
  </div>;
};
