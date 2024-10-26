import { InsertProductInput, insertProductSchema } from '@nexcom/validators/admin'
import { createFileRoute, Link, useNavigate, useRouter } from '@tanstack/react-router'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from '@nexcom/ui/components/form'
import { cn } from '@nexcom/ui/lib/utils'
import { Button, buttonVariants } from '@nexcom/ui/components/button'
import { api } from '~/router'
import { toast } from 'sonner'
import { EllipsisVertical, Loader2 } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@nexcom/ui/components/dropdown-menu'
import React from 'react'
import { ProductCreateDetails } from '~/components/products/product-create-details'

export const Route = createFileRoute('/_root-layout/products/new')({
  component: () => <NewProductComponent />,
})

function NewProductComponent() {
  const router = useRouter()
  const navigate = useNavigate()
  const [isActionsMenuOpen, setIsActionsMenuOpen] = React.useState(false);

  const form = useForm<InsertProductInput>({
    resolver: zodResolver(insertProductSchema),
  })

  const { mutate, isPending } = api.products.insert.useMutation({
    onSuccess: async () => {
      toast.success("Product updated")
      router.invalidate()
    },
    onError: (err) => {
      if (err.data?.code === "CONFLICT")
        form.setError("slug", {
          message: "This slug is already in use",
        }, {
          shouldFocus: true,
        })
      else toast.error(err.message)
    },
  })

  const onSubmit = (values: InsertProductInput) => {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="lg:space-y-0 lg:px-6"
      >
        <div className="sticky top-[54px] z-10 -mx-4 w-screen sm:mx-0 sm:w-full md:w-full bg-background">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 p-4 sm:justify-start sm:px-0">
            <h1 className="max-w-40 truncate text-lg font-semibold tracking-tight md:max-w-72 md:text-xl lg:max-w-[60%]">
              Add product
            </h1>
            <div className="hidden items-center gap-2 sm:ml-auto sm:flex">
              <Link
                to="/products"
                className={cn(
                  buttonVariants({
                    variant: "outline",
                    size: "sm",
                  })
                )}
              >
                Discard
              </Link>
              <Button
                size="sm"
                type="submit"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className='size-4 animate-spin'/>
                ): null}
                Submit
              </Button>
            </div>
            <DropdownMenu
              open={isActionsMenuOpen}
              onOpenChange={setIsActionsMenuOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-7 sm:hidden"
                >
                  <EllipsisVertical className="size-4" />
                  <span className="sr-only">Toggle form actions menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-xs">
                  Actions
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    form.handleSubmit(onSubmit)()
                    setIsActionsMenuOpen(false)
                  }}
                  disabled={isPending || !form.formState.isDirty}
                  className="text-xs"
                >
                  Submit
                  {isPending ? (
                    <Loader2 className="ml-auto size-3" />
                  ) : null}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-xs"
                  disabled={isPending || !form.formState.isDirty}
                  onClick={() => navigate({to: "/products"})}
                >
                  Discard
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="mx-auto grid w-full max-w-5xl gap-4 lg:grid-cols-[2fr,1fr] lg:px-0">
          <div className="grid auto-rows-max gap-4">
            <ProductCreateDetails />
            {/* <ProductPricingForm />
            <ProductInventoryForm />
            <ProductShippingForm />
            <ProductVariantsForm />
            <ProductSEOForm /> */}
          </div>
          <div className="grid auto-rows-max items-start gap-4">
            {/* <ProductStatusForm />
            <ProductOrganisationForm /> */}
          </div>
        </div>
      </form>
    </Form>
  )
}