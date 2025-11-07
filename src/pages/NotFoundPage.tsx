import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col justify-center items-center bg-gray-100">
      <h1 className="text-6xl font-bold text-indigo-600">404</h1>
      <p className="text-2xl text-gray-700 mt-4">Página Não Encontrada</p>
      <Link to="/" className="mt-6 text-indigo-600 hover:underline">
        Voltar ao Início
      </Link>
    </div>
  );
}