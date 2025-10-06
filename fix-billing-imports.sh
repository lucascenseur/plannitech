#!/bin/bash

# Script pour corriger les imports dans les routes de billing

echo "🔧 Correction des imports dans les routes de billing..."

# Trouver tous les fichiers .ts dans app/api/billing
find app/api/billing -name "*.ts" | while read file; do
    echo "Traitement de: $file"
    
    # Remplacer l'import auth par getServerSession et authOptions
    sed -i 's/import { auth } from '\''@\/lib\/auth'\'';/import { getServerSession } from '\''next-auth'\'';\nimport { authOptions } from '\''@\/lib\/auth'\'';/g' "$file"
    
    # Remplacer auth() par getServerSession(authOptions)
    sed -i 's/const session = await auth();/const session = await getServerSession(authOptions);/g' "$file"
done

echo "✅ Correction terminée !"
