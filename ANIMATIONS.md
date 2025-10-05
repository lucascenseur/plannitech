# 🎬 Guide des Animations - Plannitech

## 📋 Vue d'ensemble

Le site Plannitech utilise **Framer Motion** pour des animations fluides et modernes qui améliorent l'expérience utilisateur.

## 🎯 Composants d'Animation Disponibles

### Composants de Base

#### `AnimatedSection`
- **Usage** : Sections principales avec animation d'apparition
- **Animation** : Fade in + slide up depuis le bas
- **Props** : `delay`, `className`

```tsx
<AnimatedSection className="py-20" delay={0.2}>
  <h2>Titre de section</h2>
</AnimatedSection>
```

#### `AnimatedCard`
- **Usage** : Cartes avec animation et hover
- **Animation** : Fade in + slide up + hover lift
- **Props** : `delay`, `className`

```tsx
<AnimatedCard delay={0.1}>
  <Card>
    <CardHeader>Titre</CardHeader>
  </Card>
</AnimatedCard>
```

#### `AnimatedText`
- **Usage** : Textes avec animation d'apparition
- **Animation** : Fade in + slide up
- **Props** : `delay`, `className`

```tsx
<AnimatedText delay={0.4}>
  <h1>Titre principal</h1>
</AnimatedText>
```

#### `AnimatedButton`
- **Usage** : Boutons avec animation et interactions
- **Animation** : Scale in + hover scale + tap scale
- **Props** : `delay`, `className`

```tsx
<AnimatedButton delay={0.6}>
  <Button>Cliquer ici</Button>
</AnimatedButton>
```

### Composants Spécialisés

#### `AnimatedIcon`
- **Usage** : Icônes avec animation et hover
- **Animation** : Scale in + hover scale + rotate
- **Props** : `delay`, `className`

```tsx
<AnimatedIcon delay={0.2}>
  <Calendar className="w-12 h-12 text-blue-600" />
</AnimatedIcon>
```

#### `AnimatedTestimonial`
- **Usage** : Témoignages avec animation
- **Animation** : Slide in from left + hover lift
- **Props** : `delay`, `className`

```tsx
<AnimatedTestimonial delay={0.1}>
  <Card>
    <CardContent>Témoignage...</CardContent>
  </Card>
</AnimatedTestimonial>
```

#### `AnimatedCounter`
- **Usage** : Compteurs animés pour les statistiques
- **Animation** : Comptage progressif
- **Props** : `end`, `duration`, `className`

```tsx
<AnimatedCounter end={500} duration={2} />
```

### Composants de Grille

#### `AnimatedGrid`
- **Usage** : Grilles avec animation en cascade
- **Animation** : Stagger children
- **Props** : `delay`, `className`

```tsx
<AnimatedGrid className="grid md:grid-cols-3 gap-8" delay={0.4}>
  <AnimatedGridItem>Item 1</AnimatedGridItem>
  <AnimatedGridItem>Item 2</AnimatedGridItem>
</AnimatedGrid>
```

## 🎨 Variants d'Animation Prédéfinis

### Variants de Base
```tsx
// Fade in from bottom
export const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

// Fade in from left
export const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

// Fade in from right
export const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

// Scale in
export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, ease: "easeOut" }
};
```

### Variants de Grille
```tsx
// Container avec stagger
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Item avec stagger
export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
};
```

## 🚀 Utilisation dans les Pages

### Page Landing
```tsx
// Hero Section
<AnimatedSection className="py-20">
  <AnimatedText delay={0.2}>
    <Badge>Nouveau</Badge>
  </AnimatedText>
  <AnimatedText delay={0.4}>
    <h1>Titre principal</h1>
  </AnimatedText>
  <AnimatedButton delay={0.8}>
    <Button>Commencer</Button>
  </AnimatedButton>
</AnimatedSection>

// Features Grid
<div className="grid md:grid-cols-3 gap-8">
  <AnimatedCard delay={0.1}>
    <Card>Feature 1</Card>
  </AnimatedCard>
  <AnimatedCard delay={0.2}>
    <Card>Feature 2</Card>
  </AnimatedCard>
</div>
```

### Page Features
```tsx
<AnimatedSection className="py-20">
  <AnimatedText className="text-center mb-16" delay={0.2}>
    <h2>Fonctionnalités</h2>
  </AnimatedText>
  
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
    {features.map((feature, index) => (
      <AnimatedCard key={index} delay={0.1 * (index + 1)}>
        <Card>
          <AnimatedIcon delay={0.2 * (index + 1)}>
            <feature.icon className="w-12 h-12" />
          </AnimatedIcon>
          <CardTitle>{feature.title}</CardTitle>
        </Card>
      </AnimatedCard>
    ))}
  </div>
</AnimatedSection>
```

## ⚡ Optimisations Performance

### Lazy Loading
```tsx
// Animation uniquement quand visible
<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.8, delay: 0.2 }}
>
  Contenu animé
</motion.div>
```

### Réduction des Animations
```tsx
// Désactiver les animations sur mobile
const isMobile = window.innerWidth < 768;

<motion.div
  initial={isMobile ? false : { opacity: 0, y: 50 }}
  animate={isMobile ? false : { opacity: 1, y: 0 }}
>
  Contenu
</motion.div>
```

## 🎯 Bonnes Pratiques

### 1. Délais Progressifs
```tsx
// Utiliser des délais progressifs pour un effet cascade
<AnimatedText delay={0.2}>Titre</AnimatedText>
<AnimatedText delay={0.4}>Sous-titre</AnimatedText>
<AnimatedButton delay={0.6}>Bouton</AnimatedButton>
```

### 2. Animations Cohérentes
```tsx
// Utiliser les mêmes durées et easings
const standardTransition = {
  duration: 0.6,
  ease: "easeOut"
};
```

### 3. Performance
```tsx
// Utiliser will-change pour les animations complexes
<motion.div
  style={{ willChange: "transform" }}
  whileHover={{ scale: 1.05 }}
>
  Contenu
</motion.div>
```

### 4. Accessibilité
```tsx
// Respecter les préférences utilisateur
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

<motion.div
  initial={prefersReducedMotion ? false : { opacity: 0 }}
  animate={prefersReducedMotion ? false : { opacity: 1 }}
>
  Contenu
</motion.div>
```

## 🔧 Configuration

### Variables d'Environnement
```bash
# Désactiver les animations en développement
NEXT_PUBLIC_DISABLE_ANIMATIONS=false
```

### Configuration Framer Motion
```tsx
// Configuration globale
import { motion } from "framer-motion";

// Désactiver les animations si nécessaire
const shouldAnimate = process.env.NEXT_PUBLIC_DISABLE_ANIMATIONS !== "true";

export const AnimatedSection = ({ children, ...props }) => {
  if (!shouldAnimate) {
    return <section {...props}>{children}</section>;
  }
  
  return (
    <motion.section
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.section>
  );
};
```

## 📊 Métriques d'Animation

### Durées Recommandées
- **Micro-interactions** : 0.2s - 0.3s
- **Transitions de page** : 0.4s - 0.6s
- **Animations complexes** : 0.8s - 1.2s
- **Compteurs** : 1s - 3s

### Easings
- **easeOut** : Pour les entrées
- **easeIn** : Pour les sorties
- **easeInOut** : Pour les transitions
- **spring** : Pour les interactions naturelles

## 🎉 Résultat

Le site Plannitech dispose maintenant d'animations fluides et professionnelles qui :
- ✅ Améliorent l'expérience utilisateur
- ✅ Guident l'attention vers les éléments importants
- ✅ Créent une sensation de qualité et de modernité
- ✅ Respectent les bonnes pratiques de performance
- ✅ Sont accessibles et responsives

**Les animations sont maintenant parfaitement intégrées et alignées !** 🚀

