'use client'

import { useEffect, useState } from 'react'

import { foodsCollection, create, update, remove } from '@/lib/firebase.browser'
import { onSnapshot } from 'firebase/firestore'
import { Food, FoodType } from '@/types/firebase'

import FoodForm from '@/components/Forms/Food'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { NumberInput } from '@/components/ui/number-input'
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
  const [foodsByType, setFoodsByType] = useState<Record<FoodType, Food[]>>({} as Record<FoodType, Food[]>)
  const [selectedFood, setSelectedFood] = useState<Food>()
  const [loading, setLoading] = useState(true)
  const [list] = useAutoAnimate()

  useEffect(() => {
    const unsubscribe = onSnapshot(foodsCollection, (querySnapshot) => {
      const foods = querySnapshot.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }))

      const grouped = foods.reduce((acc, food) => {
        if (!acc[food.type]) {
          acc[food.type] = []
        }
        acc[food.type].push(food)
        return acc
      }, {} as Record<FoodType, Food[]>)

      Object.keys(grouped).forEach((type) => {
        grouped[type as FoodType].sort((a, b) => a.item.localeCompare(b.item))
      })

      setFoodsByType(grouped)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])


  const typeOrder: FoodType[] = ['Other', 'Dry Goods', 'Fridge', 'Bread', 'Freezer', 'Cans']

  return (
    <div className="flex flex-col gap-6 content pt-2 max-h-full overflow-y-auto">
      <FoodForm onAdd={(food) => create(foodsCollection, food)} />
      <AlertDialog>
        <div className="flex flex-col pb-8">
          {Object.keys(foodsByType).length === 0 && !loading ? (
            <span className="w-fit text-muted-foreground mx-auto pt-10">
              No food items found.
            </span>
          ) : (
            <div ref={list} className="flex flex-col overflow-y-auto">
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => <FoodSkeleton key={i} />)
              ) : (
                typeOrder.map((type) => {
                  const typeFoods = foodsByType[type]
                  if (!typeFoods || typeFoods.length === 0) return null

                  return (
                    <div key={type} className="mb-4">
                      <h3 className="text-muted-foreground pb-1 border-b text-sm font-semibold">
                        {type}
                      </h3>
                      <ul className="flex flex-col">
                        {typeFoods.map((food) => (
                          <FoodItem
                            key={food.id}
                            food={food}
                            onDelete={() => setSelectedFood(food)}
                          />
                        ))}
                      </ul>
                    </div>
                  )
                })
              )}
            </div>
          )}
        </div>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {selectedFood?.item}?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedFood(undefined)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedFood?.id) remove(foodsCollection, selectedFood.id)
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

function FoodItem({ food, onDelete }: { food: Food; onDelete: () => void }) {
  return (
    <li className="grid grid-cols-7 items-center gap-2 border-b text-sm py-1">
      <NumberInput
        value={food.quantity}
        min={1}
        max={100}
        className="col-span-2"
        onValueChange={(value) =>
          update(foodsCollection, food.id, { quantity: value ?? 1 })
        }
      />
      <span className="font-semibold text-ellipsis line-clamp-1 col-span-4">
        {food.item}
      </span>
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

function FoodSkeleton() {
  return (
    <li className="grid grid-cols-7 items-center gap-2 border-b text-sm py-1">
      <Skeleton className="w-[75px] h-[26px] col-span-2" />
      <Skeleton className="w-full h-5 col-span-4" />
      <Skeleton className="size-9 justify-self-end" />
    </li>
  )
}
