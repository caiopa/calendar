import { prismaClient } from '../../../lib/prisma';

export async function GET() {
  const eventos = await prismaClient.eventos.findMany();
  return new Response(JSON.stringify(eventos), { status: 200 });
}

export async function POST(request: Request) {
  const {title, start, end} = await request.json();
  
  const evento = await prismaClient.eventos.create({ data:
    {
      title,
      start,
      end
    }});
  return new Response(JSON.stringify(evento), { status: 201 });
}

export async function DELETE(request: Request) {
  const {id} = await request.json();
  
  const eventos = await prismaClient.eventos.delete({
    where: {
      id: id
    }
  });
  return new Response(JSON.stringify(eventos), { status: 200 });
}

export async function PATCH(request: Request) {
  
  const {id, newEvent: {title, start, end}} = await request.json();
  console.log('oi', id, title, start, end);
  
  const eventos = await prismaClient.eventos.update({
    where: {
      id: id
    },
    data: {
      title,
      start,
      end
    }
  });
  return new Response(JSON.stringify(eventos), { status: 200 });
}