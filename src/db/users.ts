import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(
  uid: string,
  email: string,
  name?: string,
  role?: string,
  facilityId?: string
) {
  try {
    const result = await db
      .insert(users)
      .values({
        uid,
        email,
        name,
        role,
        facilityId,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          ...(name ? { name } : {}),
          ...(role ? { role } : {}),
          ...(facilityId ? { facilityId } : {}),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    throw new Error('Database operation failed in getOrCreateUser', { cause: error });
  }
}
