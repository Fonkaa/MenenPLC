import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function normalizeDescriptionSteps(rawSteps: any) {
  if (rawSteps === undefined || rawSteps === null) return undefined;

  let steps = rawSteps;
  if (typeof steps === 'string') {
    try {
      steps = JSON.parse(steps);
    } catch {
      return undefined;
    }
  }

  if (!Array.isArray(steps)) return undefined;

  return steps.map((step: any, idx: number) => ({
    image: step.imageUrl || step.image || '',
    caption: step.caption || `Perspective 0${idx + 1}`,
    narrative: step.narrative || step.description || step.text || '',
  }));
}

// GET all projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST create project
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const slug =
      (data.title || 'project')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') +
      '-' +
      Date.now().toString().slice(-4);

    const galleryImages: string[] = Array.isArray(data.galleryImages)
      ? data.galleryImages
      : data.featuredImage
      ? [data.featuredImage]
      : [];

    const parsedSteps = normalizeDescriptionSteps(data.descriptionSteps);

    const created = await prisma.project.create({
      data: {
        title: data.title,
        slug: data.slug || slug,
        client: data.client || 'MENEN Client',
        associatedFirms: data.associatedFirms || 'MENEN Engineering PLC',
        location: data.location || 'Addis Ababa',
        category: data.category || 'Architecture',
        status: data.status || 'UNDER_CONSTRUCTION',
        scopeOfWork: data.scopeOfWork || '',
        awards: data.awards || null,
        description: data.description || null,
        descriptionSteps: parsedSteps || undefined,
        featuredImage: data.featuredImage || galleryImages[0] || null,
        galleryImages: galleryImages,
        featuredVideo: data.featuredVideo || null,
        audioNarrative: data.audioNarrative || null,
        creativeDirector: data.creativeDirector || 'Arch. Samiel Musolino',
        partnerInCharge: data.partnerInCharge || 'Eng. Habtamu Getu',
        projectManager: data.projectManager || 'Arch. Ephrem',
        projectTeam: data.projectTeam || 'MENEN Architecture & Engineering Studio',
        mapCoordinates: data.mapCoordinates || 'Addis Ababa, Ethiopia',
        isFeatured: Boolean(data.isFeatured),
        order: Number(data.order) || 0,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

// PUT update project
export async function PUT(req: Request) {
  try {
    const data = await req.json();
    if (!data.id) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    let galleryImages: string[] | undefined = undefined;
    if (data.galleryImages !== undefined) {
      galleryImages = Array.isArray(data.galleryImages)
        ? data.galleryImages
        : data.featuredImage
        ? [data.featuredImage]
        : [];
    }

    const parsedSteps = normalizeDescriptionSteps(data.descriptionSteps);

    const updated = await prisma.project.update({
      where: { id: data.id },
      data: {
        title: data.title !== undefined ? data.title : undefined,
        slug: data.slug !== undefined ? data.slug : undefined,
        client: data.client !== undefined ? data.client : undefined,
        associatedFirms: data.associatedFirms !== undefined ? data.associatedFirms : undefined,
        location: data.location !== undefined ? data.location : undefined,
        category: data.category !== undefined ? data.category : undefined,
        status: data.status !== undefined ? data.status : undefined,
        scopeOfWork: data.scopeOfWork !== undefined ? data.scopeOfWork : undefined,
        awards: data.awards !== undefined ? data.awards : undefined,
        description: data.description !== undefined ? data.description : undefined,
        descriptionSteps: parsedSteps !== undefined ? parsedSteps : undefined,
        featuredImage: data.featuredImage !== undefined ? data.featuredImage : undefined,
        galleryImages: galleryImages !== undefined ? galleryImages : undefined,
        featuredVideo: data.featuredVideo !== undefined ? data.featuredVideo : undefined,
        audioNarrative: data.audioNarrative !== undefined ? data.audioNarrative : undefined,
        // Fallback to default if null is passed to non-nullable fields
        creativeDirector:
          data.creativeDirector !== undefined
            ? data.creativeDirector || 'Arch. Samiel Musolino'
            : undefined,
        partnerInCharge:
          data.partnerInCharge !== undefined
            ? data.partnerInCharge || 'Eng. Habtamu Getu'
            : undefined,
        projectManager:
          data.projectManager !== undefined
            ? data.projectManager || 'Arch. Ephrem'
            : undefined,
        projectTeam:
          data.projectTeam !== undefined
            ? data.projectTeam || 'MENEN Architecture & Engineering Studio'
            : undefined,
        mapCoordinates:
          data.mapCoordinates !== undefined
            ? data.mapCoordinates || 'Addis Ababa, Ethiopia'
            : undefined,
        isFeatured: data.isFeatured !== undefined ? Boolean(data.isFeatured) : undefined,
        order: data.order !== undefined ? Number(data.order) : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE project
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    await prisma.project.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}