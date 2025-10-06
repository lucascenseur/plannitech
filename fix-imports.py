#!/usr/bin/env python3
import os
import re
import glob

def fix_billing_imports():
    """Corriger les imports dans les routes de billing"""
    
    # Trouver tous les fichiers .ts dans app/api/billing
    billing_files = glob.glob("app/api/billing/**/*.ts", recursive=True)
    
    for file_path in billing_files:
        print(f"Traitement de: {file_path}")
        
        try:
            # Lire le fichier
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Remplacer l'import auth
            if "import { auth } from '@/lib/auth';" in content:
                content = content.replace(
                    "import { auth } from '@/lib/auth';",
                    "import { getServerSession } from 'next-auth';\nimport { authOptions } from '@/lib/auth';"
                )
                print(f"  - Import auth remplacé")
            
            # Remplacer auth() par getServerSession(authOptions)
            if "const session = await auth();" in content:
                content = content.replace(
                    "const session = await auth();",
                    "const session = await getServerSession(authOptions);"
                )
                print(f"  - auth() remplacé par getServerSession(authOptions)")
            
            # Écrire le fichier modifié
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
                
        except Exception as e:
            print(f"  - Erreur: {e}")

if __name__ == "__main__":
    fix_billing_imports()
    print("✅ Correction terminée !")
