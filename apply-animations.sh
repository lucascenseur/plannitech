#!/bin/bash

# Script pour appliquer les animations à toutes les pages marketing
echo "🎬 Application des animations à toutes les pages..."

# Fonction pour ajouter les imports d'animations
add_animation_imports() {
    local file="$1"
    
    # Vérifier si les imports d'animations sont déjà présents
    if ! grep -q "AnimatedSection" "$file"; then
        echo "  📝 Ajout des imports d'animations à $file"
        
        # Ajouter les imports après les imports existants
        sed -i '' '/import { MarketingFooter } from/a\
import { \
  AnimatedSection, \
  AnimatedText, \
  AnimatedButton, \
  AnimatedCard, \
  AnimatedIcon,\
  AnimatedGrid,\
  AnimatedGridItem\
} from "@/components/ui/animations";' "$file"
    else
        echo "  ✅ Les animations sont déjà présentes dans $file"
    fi
}

# Pages à traiter
pages=(
    "app/blog/page.tsx"
    "app/demo/page.tsx"
)

# Appliquer les animations à chaque page
for page in "${pages[@]}"; do
    if [ -f "$page" ]; then
        echo "🎯 Traitement de $page"
        add_animation_imports "$page"
    else
        echo "⚠️  Fichier $page non trouvé"
    fi
done

echo "🎉 Animations appliquées avec succès !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Vérifiez que les imports sont corrects"
echo "2. Ajoutez manuellement les composants d'animation dans les sections"
echo "3. Testez les animations sur le site"
echo ""
echo "💡 Conseil : Utilisez les composants AnimatedSection, AnimatedText, AnimatedCard, etc."
echo "   pour envelopper vos éléments existants avec des délais progressifs."

