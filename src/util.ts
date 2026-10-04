// Copyright 2026 The Casdoor Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// getId returns name as is if it's already an "owner/name" ID, otherwise prefixes it with defaultOwner
export function getId(name: string, defaultOwner: string): string {
  if (name.includes('/')) {
    return name
  }
  return `${defaultOwner}/${name}`
}

// getAdminId is getId for the object types that are owned by "admin" instead of an organization
export function getAdminId(name: string): string {
  return getId(name, 'admin')
}

// getOwner keeps the caller-provided owner and only falls back to defaultOwner when it's empty
export function getOwner(
  owner: string | undefined,
  defaultOwner: string,
): string {
  return owner ? owner : defaultOwner
}

// CasdoorResponse is the JSON body returned by the Casdoor APIs, data2 is the total count of the pagination APIs
export interface CasdoorResponse<T = unknown, T2 = unknown> {
  status: 'ok' | 'error'
  msg: string
  data: T
  data2?: T2
}
