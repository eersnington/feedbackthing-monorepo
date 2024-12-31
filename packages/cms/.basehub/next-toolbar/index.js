// This file was generated by basehub. Do not edit directly. Read more: https://basehub.com/docs/api-reference/basehub-sdk

/* eslint-disable */
/* eslint-disable eslint-comments/no-restricted-disable */
/* tslint:disable */

import "./chunk-YSQDPG26.js";

// ../../node_modules/.pnpm/basehub@7.5.28_@babel+runtime@7.24.6_@types+react@19.0.1_enquirer@2.4.1_react-dom@19.0.0_reac_dg3unnfihpy5trh74sikmblzsq/node_modules/basehub/src/next/toolbar/server-toolbar.tsx
import * as React from "react";
import { draftMode } from "next/headers";
import { revalidateTag } from "next/cache";
import {
  getStuffFromEnv,
  resolvedRef
} from "../index";
var LazyClientConditionalRenderer = React.lazy(
  () => import("./client-conditional-renderer-WDOB2ISX.js").then((mod) => ({
    default: mod.ClientConditionalRenderer
  }))
);
var ServerToolbar = async ({
  ...basehubProps
}) => {
  const { isForcedDraft } = getStuffFromEnv(basehubProps);
  const enableDraftMode = async ({
    bshbPreviewToken
  }) => {
    "use server";
    const { headers, url } = getStuffFromEnv(basehubProps);
    const appApiEndpoint = getBaseHubAppApiEndpoint(
      url,
      "/api/nextjs/preview-auth"
    );
    const res = await fetch(appApiEndpoint, {
      cache: "no-store",
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-basehub-token": headers["x-basehub-token"]
      },
      body: JSON.stringify({ bshbPreview: bshbPreviewToken })
    });
    try {
      const responseIsJson = res.headers.get("content-type")?.includes("json");
      if (!responseIsJson) {
        return { status: 400, response: { error: "Bad request" } };
      }
      const response = await res.json();
      if (res.status === 200)
        (await draftMode()).enable();
      return { status: res.status, response };
    } catch (error) {
      return { status: 500, response: { error: "Something went wrong" } };
    }
  };
  const getLatestBranches = async ({
    bshbPreviewToken
  }) => {
    "use server";
    const { headers, url } = getStuffFromEnv(basehubProps);
    const appApiEndpoint = getBaseHubAppApiEndpoint(
      url,
      "/api/nextjs/latest-branches"
    );
    const res = await fetch(appApiEndpoint, {
      cache: "no-store",
      method: "GET",
      headers: {
        "content-type": "application/json",
        "x-basehub-token": headers["x-basehub-token"],
        "x-basehub-preview-token": bshbPreviewToken
      }
    });
    try {
      const responseIsJson = res.headers.get("content-type")?.includes("json");
      if (!responseIsJson) {
        return { status: 400, response: { error: "Bad request" } };
      }
      const response = await res.json();
      return { status: res.status, response };
    } catch (error) {
      return { status: 500, response: { error: "Something went wrong" } };
    }
  };
  const disableDraftMode = async () => {
    "use server";
    (await draftMode()).disable();
  };
  const revalidateTags = async ({ tags }) => {
    "use server";
    await Promise.all(
      tags.map(async (tag) => {
        if (tag.startsWith("basehub-")) {
          await revalidateTag(tag);
        }
      })
    );
    return { success: true };
  };
  const humanRevalidatePendingTags = async ({
    bshbPreviewToken,
    ref
  }) => {
    "use server";
    const { headers, url } = getStuffFromEnv(basehubProps);
    const appApiEndpoint = getBaseHubAppApiEndpoint(
      url,
      "/api/nextjs/pending-tags"
    );
    const res = await fetch(appApiEndpoint, {
      cache: "no-store",
      method: "GET",
      headers: {
        "content-type": "application/json",
        "x-basehub-token": headers["x-basehub-token"],
        "x-basehub-preview-token": bshbPreviewToken,
        "x-basehub-ref": ref
      }
    });
    if (res.status !== 200) {
      return { success: false };
    }
    const response = await res.json();
    const tags = response;
    if (!tags || !Array.isArray(tags)) {
      return { success: false };
    }
    return await revalidateTags({ tags });
  };
  return /* @__PURE__ */ React.createElement(
    LazyClientConditionalRenderer,
    {
      draft: (await draftMode()).isEnabled,
      isForcedDraft,
      enableDraftMode,
      disableDraftMode,
      revalidateTags,
      getLatestBranches,
      resolvedRef,
      humanRevalidatePendingTags
    }
  );
};
function getBaseHubAppApiEndpoint(url, pathname) {
  let origin;
  switch (true) {
    case url.origin.includes("api.basehub.com"):
      origin = "https://basehub.com" + pathname + url.search + url.hash;
      break;
    case url.origin.includes("api.bshb.dev"):
      origin = "https://basehub.dev" + pathname + url.search + url.hash;
      break;
    case url.origin.includes("localhost:3001"):
      origin = "http://localhost:3000" + pathname + url.search + url.hash;
      break;
    default:
      origin = url.origin + pathname + url.search + url.hash;
  }
  return origin;
}
export {
  ServerToolbar as Toolbar
};
