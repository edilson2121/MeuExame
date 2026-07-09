'use client';

import React from 'react';

export function WelcomeBanner() {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold">Bem-vindo ao MeuExame!</h1>
      <p className="mt-2">Continue seus estudos e prepare-se para o sucesso.</p>
    </div>
  );
}

export default WelcomeBanner;
