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

import { AxiosResponse } from 'axios'
import { Config } from './config'
import Request from './request'

export interface Notification {
  content: string
  recipient: string
}

export class NotificationSDK {
  private config: Config
  private readonly request: Request

  constructor(config: Config, request: Request) {
    this.config = config
    this.request = request
  }

  // sendNotification sends the content to the recipient by the organization's notification provider
  public async sendNotification(notification: Notification) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.post(
      '/send-notification',
      notification,
    )) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }
}
