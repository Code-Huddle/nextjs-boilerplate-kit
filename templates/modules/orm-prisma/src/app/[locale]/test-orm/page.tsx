'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Database from 'lucide-react/dist/esm/icons/database';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Edit from 'lucide-react/dist/esm/icons/edit';
import Trash from 'lucide-react/dist/esm/icons/trash';
import Save from 'lucide-react/dist/esm/icons/save';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import Zap from 'lucide-react/dist/esm/icons/zap';
import Code from 'lucide-react/dist/esm/icons/code';
import Info from 'lucide-react/dist/esm/icons/info';
import AlertTriangle from 'lucide-react/dist/esm/icons/alert-triangle';
import Link from 'next/link';
import { useState } from 'react';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '@/hooks/useDatabaseOperations';
import type { User } from '@prisma/client';

export default function TestORMPage() {
  const [userForm, setUserForm] = useState({ name: '', email: '' });
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Users hooks
  const { data: users, isLoading: usersLoading } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser.mutateAsync(userForm);
      setUserForm({ name: '', email: '' });
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      await updateUser.mutateAsync({ id: editingUser.id, data: userForm });
      setEditingUser(null);
      setUserForm({ name: '', email: '' });
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUser.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-purple-500/10" />
        <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-12">
          {/* Header Navigation */}
          <div className="flex items-center justify-between mb-12">
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Badge variant="secondary" className="text-xs">
              <Database className="mr-1 h-3 w-3" />
              Prisma ORM
            </Badge>
          </div>

          {/* Hero Content */}
          <div className="text-center mb-16">
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm">
              <Database className="h-10 w-10 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-foreground mb-6">
              Prisma ORM Testing
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Test database operations with Prisma ORM. Create, read, update, and delete users with powerful database toolkit and introspection.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge variant="outline" className="text-sm px-4 py-2">
                <CheckCircle className="mr-2 h-4 w-4" />
                Feature-rich
              </Badge>
              <Badge variant="outline" className="text-sm px-4 py-2">
                <Zap className="mr-2 h-4 w-4" />
                Introspection
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-16" />

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Setup Instructions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Setup Status */}
            <Card className="border-futuristic bg-gradient-to-br from-purple-500/5 to-pink-500/5 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10">
                    <Database className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">Prisma Active</h3>
                    <p className="text-sm text-muted-foreground">Database operations ready</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-muted-foreground">Type-safe queries</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-muted-foreground">Database introspection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-muted-foreground">Migration support</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Setup Instructions */}
            <Card className="border-futuristic bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Code className="h-5 w-5" />
                  <span>Setup Instructions</span>
                  <Badge variant="outline" className="text-xs">
                    <Info className="mr-1 h-3 w-3" />
                    Prisma
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Follow these steps to configure Prisma ORM
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Step 1 */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">1</div>
                      <h4 className="font-medium text-foreground">Environment Setup</h4>
                    </div>
                    <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-800 dark:bg-blue-950/20">
                      <code className="text-xs font-mono">cp .env.example .env.local</code>
                      <p className="text-xs text-muted-foreground mt-1">Add your database connection string</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">2</div>
                      <h4 className="font-medium text-foreground">Generate Client</h4>
                    </div>
                    <div className="rounded-lg border border-purple-200 bg-purple-50/50 p-3 dark:border-purple-800 dark:bg-purple-950/20">
                      <code className="text-xs font-mono">npx prisma generate</code>
                      <p className="text-xs text-muted-foreground mt-1">Generate Prisma client from schema</p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">3</div>
                      <h4 className="font-medium text-foreground">Run Migrations</h4>
                    </div>
                    <div className="rounded-lg border border-orange-200 bg-orange-50/50 p-3 dark:border-orange-800 dark:bg-orange-950/20">
                      <code className="text-xs font-mono">npx prisma db push</code>
                      <p className="text-xs text-muted-foreground mt-1">Create tables in your database</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-800 dark:bg-amber-950/20">
                  <div className="flex items-start gap-3">
                    <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-foreground">Prisma Benefits</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Prisma provides powerful database introspection, migrations, and excellent developer tooling with type safety.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - User Management */}
          <div className="lg:col-span-2">
            <div className="sticky top-8 space-y-6">
              {/* Create/Edit User Form */}
              <Card className="border-futuristic bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    {editingUser ? 'Edit User' : 'Create User'}
                  </CardTitle>
                  <CardDescription>
                    {editingUser ? 'Update user information' : 'Add a new user to the database'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={userForm.name}
                          onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                          placeholder="Enter user name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={userForm.email}
                          onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                          placeholder="Enter email address"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={createUser.isPending || updateUser.isPending}>
                        <Save className="mr-2 h-4 w-4" />
                        {editingUser ? 'Update User' : 'Create User'}
                      </Button>
                      {editingUser && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditingUser(null);
                            setUserForm({ name: '', email: '' });
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Users List */}
              <Card className="border-futuristic bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Users ({users?.length || 0})</span>
                    <Badge variant="outline" className="text-xs">
                      <Database className="mr-1 h-3 w-3" />
                      Prisma ORM
                    </Badge>
                  </CardTitle>
                  <CardDescription>Manage users in the database</CardDescription>
                </CardHeader>
                <CardContent>
                  {usersLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Loading users...</p>
                    </div>
                  ) : users && users.length > 0 ? (
                    <div className="space-y-4">
                      {users.map((user) => (
                        <div key={user.id} className="group flex items-center justify-between p-4 border border-border/50 rounded-lg hover:border-primary/30 transition-colors">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10">
                                <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <h3 className="font-semibold text-foreground">{user.name}</h3>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                <p className="text-xs text-muted-foreground">
                                  Created: {new Date(user.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingUser(user);
                                setUserForm({ name: user.name, email: user.email });
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
                        <Database className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">No users found</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Create your first user to get started with database operations
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <Card className="border-futuristic bg-card/30 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/50">
                <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Type Safety</h3>
              <p className="text-sm text-muted-foreground">
                Full TypeScript support with auto-generated types from your database schema
              </p>
            </CardContent>
          </Card>

          <Card className="border-futuristic bg-card/30 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Introspection</h3>
              <p className="text-sm text-muted-foreground">
                Powerful database introspection with automatic schema generation and migration support
              </p>
            </CardContent>
          </Card>

          <Card className="border-futuristic bg-card/30 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Developer Tools</h3>
              <p className="text-sm text-muted-foreground">
                Excellent developer experience with Prisma Studio, migrations, and comprehensive tooling
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
