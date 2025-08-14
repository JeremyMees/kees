'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import { recipesCollection, create, remove } from '@/lib/firebase.browser'
import { onSnapshot } from 'firebase/firestore'
import { Recipe } from '@/types/firebase'

import RecipeForm from '@/components/Forms/Recipe'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { X } from 'lucide-react'

export default function Page() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>()
  const [loading, setLoading] = useState(true)
  const [list] = useAutoAnimate()

  useEffect(() => {
    const unsubscribe = onSnapshot(recipesCollection, (querySnapshot) => {
      setRecipes(
        querySnapshot.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }))
          .sort((a, b) => a.description.localeCompare(b.description))
      )
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className="flex flex-col gap-6 content pt-2 max-h-full overflow-y-auto">
      <RecipeForm onAdd={(recipe) => create(recipesCollection, recipe)} />
      <AlertDialog>
        <ul ref={list} className="flex flex-col pb-8 overflow-y-auto">
          {loading
            ? Array.from({ length: 10 }).map((_, i) => (
                <RecipeSkeleton key={i} />
              ))
            : recipes.map((recipe) => (
                <RecipeItem
                  key={recipe.id}
                  recipe={recipe}
                  onDelete={() => setSelectedRecipe(recipe)}
                />
              ))}
        </ul>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Remove {selectedRecipe?.description}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedRecipe(undefined)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedRecipe?.id) {
                  remove(recipesCollection, selectedRecipe.id)
                }
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function RecipeItem({
  recipe,
  onDelete,
}: {
  recipe: Recipe
  onDelete: () => void
}) {
  return (
    <li className="flex items-center justify-between gap-2 border-b text-sm py-1">
      <Link
        href={recipe.link}
        target="_blank"
        className="font-semibold text-ellipsis line-clamp-1"
      >
        {recipe.description}
      </Link>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="justify-self-end"
          onClick={onDelete}
        >
          <X />
        </Button>
      </AlertDialogTrigger>
    </li>
  )
}

function RecipeSkeleton() {
  return (
    <li className="flex items-center justify-between gap-2 border-b py-1">
      <Skeleton className="w-2/3 h-5" />
      <Skeleton className="size-9" />
    </li>
  )
}
