import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Stockage temporaire des tâches en mémoire
let tasks: any[] = [];

// Stockage temporaire des assignations en mémoire
let taskAssignments: any[] = [];

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    let filteredTasks = tasks;
    if (projectId) {
      filteredTasks = tasks.filter(task => task.projectId === projectId);
    }

    // Enrichir les tâches avec les assignations
    const tasksWithAssignments = filteredTasks.map(task => ({
      ...task,
      assignments: taskAssignments.filter(assignment => assignment.taskId === task.id)
    }));

    return NextResponse.json({ tasks: tasksWithAssignments });
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches:', error);
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
    
    const newTask = {
      id: (tasks.length + 1).toString(),
      projectId: body.projectId,
      name: body.name,
      description: body.description || '',
      status: body.status || 'TODO',
      priority: body.priority || 'MEDIUM',
      estimatedHours: body.estimatedHours || 0,
      actualHours: 0,
      startDate: body.startDate || null,
      endDate: body.endDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tasks.push(newTask);

    return NextResponse.json({ 
      message: 'Tâche créée avec succès',
      task: newTask 
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la tâche:', error);
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

    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
      return NextResponse.json({ message: 'Tâche non trouvée' }, { status: 404 });
    }

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ 
      message: 'Tâche mise à jour avec succès',
      task: tasks[taskIndex] 
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la tâche:', error);
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

    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
      return NextResponse.json({ message: 'Tâche non trouvée' }, { status: 404 });
    }

    // Supprimer les assignations associées
    taskAssignments = taskAssignments.filter(assignment => assignment.taskId !== id);
    
    // Supprimer la tâche
    tasks.splice(taskIndex, 1);

    return NextResponse.json({ message: 'Tâche supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la tâche:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
