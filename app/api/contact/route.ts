import { NextRequest, NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
import nodemailer from "nodemailer";

export async function GET() {
  try {
    const submissions = await prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Erreur GET /api/contact :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    const newContact = await prisma.contact.create({
      data: { name, email, message },
    });

    console.log("Contact créé dans la DB :", newContact);

    // Vérification si les variables d'environnement sont bien chargées
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "****" : "NON DEFINI");

    const transporter = nodemailer.createTransport({
      host: "ssl0.ovh.net",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email, // envoie à l'adresse email saisie dans le formulaire
      subject: "Merci pour votre inscription",
      text: `Bonjour ${name}, Merci pour votre message :
      "${message}"
      Nous allons le prendre en compte et vous répondre rapidement.`,
    };

    console.log("Envoi mail avec :", mailOptions);

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, data: newContact });
  } catch (error: any) {
    console.error("Erreur dans POST /api/contact :", error);
    return NextResponse.json(
      { error: "Erreur serveur", details: error.message },
      { status: 500 }
    );
  }
}
