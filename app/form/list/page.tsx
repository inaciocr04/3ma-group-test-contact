"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/src/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";

type Contact = {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

export default function ContactList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Hook useEffect pour effectuer la requête fetch une seule fois au chargement du composant
  useEffect(() => {
    fetch("/api/contact")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement");
        return res.json();
      })
      .then((data) => setContacts(data))
      .catch((err) => setError(err.message));
  }, []);

  // Affichage d'un message d'erreur si problème durant le fetch
  if (error)
    return (
      <p className="text-red-600 font-medium my-4 text-center">
        Erreur : {error}
      </p>
    );

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Link
        href="/form"
        className="inline-block mb-4 text-blue-600 hover:underline"
      >
        ← Retour au formulaire
      </Link>
      <Card className="mb-6 bg-blue-50 border border-blue-200">
        <CardTitle className="text-2xl text-blue-800 font-bold px-4 py-3">
          Liste des soumissions
        </CardTitle>
      </Card>

      {contacts.length === 0 ? (
        <p className="text-center text-gray-500">
          Aucune soumission pour le moment.
        </p>
      ) : (
        contacts.map((contact) => (
          <Card
            key={contact.id}
            className="mb-4 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <CardContent className="space-y-2">
              <CardTitle className="text-lg font-semibold text-gray-900">
                {contact.name}
              </CardTitle>
              <CardDescription className="text-sm text-gray-500">
                {contact.email}
              </CardDescription>
              <p className="whitespace-pre-wrap text-gray-700">
                {contact.message}
              </p>
              <small className="block text-xs text-gray-400">
                Envoyé le : {new Date(contact.createdAt).toLocaleString()}
              </small>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
