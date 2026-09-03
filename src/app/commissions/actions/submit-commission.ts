"use server";

import { createClient } from "@/lib/supabase/server";

const MAX_REFERENCE_SIZE = 5 * 1024 * 1024;

type SubmitCommissionResult = {
  success: boolean;
  error?: string;
};

export async function submitCommission(
  _previousState: SubmitCommissionResult,
  formData: FormData,
): Promise<SubmitCommissionResult> {
  const name = String(formData.get("name") ?? "").trim();
  const contact = String(formData.get("contact") ?? "").trim();
  const artworkType = String(formData.get("type") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const budget = String(formData.get("budget") ?? "").trim();

  if (!name || !contact || !artworkType || !description) {
    return {
      success: false,
      error: "Please complete all required fields.",
    };
  }

  if (name.length > 120 || contact.length > 200 || description.length > 5000) {
    return {
      success: false,
      error: "One or more fields are too long.",
    };
  }

  if (budget.length > 100) {
    return {
      success: false,
      error: "The budget field is too long.",
    };
  }

  const reference = formData.get("reference");

  if (!(reference instanceof File) || reference.size === 0) {
    return await createCommission({
      name,
      contact,
      artworkType,
      description,
      budget,
      referencePath: null,
    });
  }

  if (reference.size > MAX_REFERENCE_SIZE) {
    return {
      success: false,
      error: "Reference images must be 5 MB or smaller.",
    };
  }

  if (!reference.type.startsWith("image/")) {
    return {
      success: false,
      error: "The reference file must be an image.",
    };
  }

  const supabase = await createClient();
  const extension = reference.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `requests/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("commission-references")
    .upload(path, reference, {
      contentType: reference.type,
      upsert: false,
    });

  if (uploadError) {
    return {
      success: false,
      error: "Could not upload the reference image. Please try again.",
    };
  }

  const result = await createCommission({
    name,
    contact,
    artworkType,
    description,
    budget,
    referencePath: path,
  });

  if (!result.success) {
    await supabase.storage
      .from("commission-references")
      .remove([path]);
  }

  return result;
}

async function createCommission({
  name,
  contact,
  artworkType,
  description,
  budget,
  referencePath,
}: {
  name: string;
  contact: string;
  artworkType: string;
  description: string;
  budget: string;
  referencePath: string | null;
}): Promise<SubmitCommissionResult> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("commission_requests")
    .insert({
      name,
      contact,
      artwork_type: artworkType,
      description,
      budget: budget || null,
      reference_path: referencePath,
    });

  if (error) {
    return {
      success: false,
      error: "Could not send your commission request. Please try again.",
    };
  }

  return {
    success: true,
  };
}
