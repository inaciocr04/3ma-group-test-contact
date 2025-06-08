"use client";

import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { useState } from "react";
import Link from "next/link";

export default function Page() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = useState<null | "success" | "error">(null);

  // Fonction de validation des champs du formulaire
  // Vérifie que les champs requis sont remplis et que l'email est au bon format
  const validate = () => {
    const newErrors: typeof errors = {};
    if (!form.name.trim()) newErrors.name = "Le nom est requis.";
    if (!form.email.trim()) {
      newErrors.email = "L’email est requis.";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) {
      // vérification du format du mail avec une expressions régulières (regex)
      newErrors.email = "Format d’email invalide.";
    }
    if (!form.message.trim()) newErrors.message = "Le message est requis.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Envoi des données au endpoint /api/contact en POST au format JSON
    // En cas de succès, le statut est mis à "success", sinon à "error"
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "success" : "error");
      if (res.ok) setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 shadow-lg border rounded-xl">
      <h1 className="text-2xl font-semibold mb-4">Contactez-nous</h1>
      <Link
        href="/form/list"
        className="inline-block mb-4 text-blue-600 hover:underline"
      >
        Accéder à la liste des contacts
      </Link>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            name="name"
            placeholder="Nom"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />{" "}
          {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
        </div>
        <div>
          <Input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && (
            <p className="text-red-600 text-sm">{errors.email}</p>
          )}
        </div>
        <div>
          <Textarea
            name="message"
            placeholder="Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
          {errors.message && (
            <p className="text-red-600 text-sm">{errors.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded"
        >
          Envoyer
        </button>
        {status === "success" && (
          <p className="text-green-600">Message envoyé avec succès.</p>
        )}
        {status === "error" && (
          <p className="text-red-600">Une erreur est survenue.</p>
        )}
      </form>
    </div>
  );
}
