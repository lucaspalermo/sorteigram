import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    url: "https://sorteigram.app/api/auth/delete-data",
    instructions:
      "Para solicitar a exclusão dos seus dados, envie um e-mail para l.simports@hotmail.com com o assunto 'Exclusão de Dados'. Processaremos sua solicitação em até 15 dias úteis.",
  });
}

export async function POST(req: Request) {
  // Facebook Data Deletion callback
  const body = await req.json().catch(() => ({}));

  return NextResponse.json({
    url: "https://sorteigram.app/api/auth/delete-data",
    confirmation_code: `DEL-${Date.now()}`,
  });
}
