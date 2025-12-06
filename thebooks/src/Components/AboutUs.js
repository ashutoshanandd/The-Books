import React from "react";

export default function AboutUs() {
  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-10 bg-gray-50 text-gray-800">
      <h1 className="text-4xl font-bold mb-6">About Us</h1>

      <div className="max-w-3xl bg-white shadow-lg rounded-2xl p-6 leading-relaxed space-y-4">
        <p>
          Welcome to our <span className="font-semibold">Library Management App</span> — a modern
          and efficient platform designed to make managing books simple, fast, and
          user‑friendly.
        </p>

        <p>
          Our goal is to help users browse, borrow, and track books effortlessly. Whether
          you're a student, reader, or librarian, this system ensures smooth and organized
          access to the entire library collection.
        </p>

        <h2 className="text-2xl font-semibold mt-4">What We Offer</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Easy book browsing with detailed information</li>
          <li>Secure login and authentication</li>
          <li>Borrowing and returning books with one click</li>
          <li>Tracking borrowed books and due dates</li>
          <li>Clean and responsive UI for better experience</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6">Our Vision</h2>
        <p>
          We aim to digitalize library operations and reduce manual work so that users and
          librarians can focus more on reading and learning rather than paperwork.
        </p>

        <p className="mt-6 text-center font-medium text-lg">
          Thank you for using our Library Management App!
        </p>
      </div>
    </div>
  );
}
