"use client";

import { useState } from "react";
import { User as PrismaUser, Role } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import toast from "react-hot-toast";
import {
  Mail,
  MoreVertical,
  Search,
  Filter,
  Briefcase,
  GraduationCap,
  Trash2,
  Edit,
  Plus,
  Loader2,
  User as UserIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const userSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .optional()
    .or(z.literal("")),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional()
    .or(z.literal("")),
  role: z.enum(["student", "alumni", "admin"]),
});

type UserFormValues = z.infer<typeof userSchema>;
type UserWithProfile = PrismaUser;

export default function UsersClient({
  initialUsers,
}: {
  initialUsers: UserWithProfile[];
}) {
  const [users, setUsers] = useState<UserWithProfile[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithProfile | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
      role: "student",
    },
  });

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const onSubmit = async (values: UserFormValues) => {
    setIsLoading(true);
    const toastId = toast.loading(
      isAddModalOpen ? "Creating user..." : "Updating user...",
    );
    try {
      const url = isAddModalOpen
        ? "/api/admin/users"
        : `/api/admin/users/${selectedUser?.authentikId}`;
      const method = isAddModalOpen ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        if (isAddModalOpen) {
          setUsers([data.prismaUser, ...users]);
          setIsAddModalOpen(false);
          toast.success("User created successfully!", { id: toastId });
        } else {
          // Update local state immediately
          setUsers(
            users.map((u) =>
              u.id === selectedUser?.id
                ? {
                    ...u,
                    name: values.name,
                    email: values.email,
                    role: values.role.toUpperCase() as Role,
                  }
                : u,
            ),
          );
          setIsEditModalOpen(false);
          setSelectedUser(null);
          toast.success("User updated successfully!", { id: toastId });
        }
        form.reset();
      } else {
        toast.error(`Error: ${data.error || "Action failed"}`, { id: toastId });
      }
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("An unexpected error occurred", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setIsLoading(true);
    const toastId = toast.loading("Deleting user...");
    try {
      const res = await fetch(`/api/admin/users/${selectedUser.authentikId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setUsers(users.filter((u) => u.id !== selectedUser.id));
        setIsDeleteModalOpen(false);
        toast.success("User deleted successfully!", { id: toastId });
      } else {
        const data = await res.json();
        toast.error(`Error: ${data.error || "Delete failed"}`, { id: toastId });
      }
    } catch (err) {
      toast.error("Failed to delete user", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (user: UserWithProfile) => {
    setSelectedUser(user);
    form.reset({
      username: user.email.split("@")[0],
      name: user.name,
      email: user.email,
      password: "",
      role: user.role.toLowerCase() as any,
    });
    setIsEditModalOpen(true);
  };

  return (
    <div className="container mx-auto py-10 space-y-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            User Management
          </h1>
          <p className="text-xl text-muted-foreground mt-2">
            Manage your platform's users and their roles.
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => {
            setIsAddModalOpen(true);
            form.reset();
          }}
          className="shadow-lg"
        >
          <Plus className="mr-2 h-5 w-5" /> Add New User
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-11"
          />
        </div>
        <Button variant="outline" size="icon" className="h-11 w-11">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[300px] font-bold">User</TableHead>
              <TableHead className="font-bold">Role</TableHead>
              <TableHead className="font-bold">Academic</TableHead>
              <TableHead className="font-bold">Professional</TableHead>
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-muted-foreground italic"
                >
                  No users found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((u) => (
                <TableRow
                  key={u.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border-2 border-primary/20 shadow-sm">
                        {u.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-base">{u.name}</span>
                        <span className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                          <Mail className="h-3.5 w-3.5" /> {u.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black border-2 uppercase tracking-widest ${
                        u.role === "ADMIN"
                          ? "bg-orange-100 text-orange-900 border-orange-200"
                          : u.role === "ALUMNI"
                            ? "bg-purple-100 text-purple-900 border-purple-200"
                            : "bg-green-100 text-green-900 border-green-200"
                      }`}
                    >
                      {u.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-medium">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      <span>{u.major || "N/A"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-medium">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <span>{u.company || "N/A"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openEditModal(u)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => {
                            setSelectedUser(u);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Modal */}
      <Dialog
        open={isAddModalOpen || isEditModalOpen}
        onOpenChange={(val) => {
          if (!val) {
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px] overflow-hidden flex flex-col max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {isAddModalOpen ? "Create New User" : "Update User Profile"}
            </DialogTitle>
            <DialogDescription>
              {isAddModalOpen
                ? "Enter the details below to add a new member to the platform."
                : "Make changes to the user's information here."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 py-4 overflow-y-auto pr-2 custom-scrollbar"
            >
              {isAddModalOpen && (
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isAddModalOpen && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="alumni">Alumni</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-6 sticky bottom-0 bg-background pb-1">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="min-w-[120px]"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {isAddModalOpen ? "Create User" : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <Trash2 className="h-10 w-10 text-destructive" />
            </div>
            <div className="text-center">
              <DialogTitle className="text-2xl font-bold">
                Confirm Deletion
              </DialogTitle>
              <DialogDescription className="text-base mt-2">
                Are you sure you want to delete{" "}
                <span className="font-bold text-foreground">
                  {selectedUser?.name}
                </span>
                's account? This will permanently remove all data from both
                Authentik and our database.
              </DialogDescription>
            </div>
          </DialogHeader>
          <DialogFooter className="gap-3 sm:justify-center pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1"
            >
              Keep User
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={isLoading}
              className="flex-1 font-bold shadow-md"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
