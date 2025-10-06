import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Stockage temporaire des assignations en mémoire
let taskAssignments: any[] = [];

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');
    const contactId = searchParams.get('contactId');

    let filteredAssignments = taskAssignments;
    if (taskId) {
      filteredAssignments = filteredAssignments.filter(assignment => assignment.taskId === taskId);
    }
    if (contactId) {
      filteredAssignments = filteredAssignments.filter(assignment => assignment.contactId === contactId);
    }

    return NextResponse.json({ assignments: filteredAssignments });
  } catch (error) {
    console.error('Erreur lors de la récupération des assignations:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Vérifier si l'assignation existe déjà
    const existingAssignment = taskAssignments.find(
      assignment => assignment.taskId === body.taskId && assignment.contactId === body.contactId
    );

    if (existingAssignment) {
      return NextResponse.json({ message: 'Cette personne est déjà assignée à cette tâche' }, { status: 409 });
    }

    const newAssignment = {
      id: (taskAssignments.length + 1).toString(),
      taskId: body.taskId,
      contactId: body.contactId,
      role: body.role || 'ASSIGNEE',
      hourlyRate: body.hourlyRate || 0,
      estimatedHours: body.estimatedHours || 0,
      actualHours: 0,
      status: 'ASSIGNED',
      assignedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    taskAssignments.push(newAssignment);

    return NextResponse.json({ 
      message: 'Assignation créée avec succès',
      assignment: newAssignment 
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de l\'assignation:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    const assignmentIndex = taskAssignments.findIndex(assignment => assignment.id === id);
    if (assignmentIndex === -1) {
      return NextResponse.json({ message: 'Assignation non trouvée' }, { status: 404 });
    }

    taskAssignments[assignmentIndex] = {
      ...taskAssignments[assignmentIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ 
      message: 'Assignation mise à jour avec succès',
      assignment: taskAssignments[assignmentIndex] 
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'assignation:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'ID requis' }, { status: 400 });
    }

    const assignmentIndex = taskAssignments.findIndex(assignment => assignment.id === id);
    if (assignmentIndex === -1) {
      return NextResponse.json({ message: 'Assignation non trouvée' }, { status: 404 });
    }

    taskAssignments.splice(assignmentIndex, 1);

    return NextResponse.json({ message: 'Assignation supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'assignation:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
