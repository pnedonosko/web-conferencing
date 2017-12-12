/*
 * Copyright (C) 2003-2017 eXo Platform SAS.
 *
 * This is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation; either version 2.1 of
 * the License, or (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this software; if not, write to the Free
 * Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301 USA, or see the FSF site: http://www.fsf.org.
 */
package org.exoplatform.webconferencing;

import java.util.Collection;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.Set;

/**
 * Created by The eXo Platform SAS.
 *
 * @author <a href="mailto:pnedonosko@exoplatform.com">Peter Nedonosko</a>
 * @version $Id: CallInfo.java 00000 Jun 19, 2017 pnedonosko $
 */
public class CallInfo {

  /** The id. */
  protected final String        id;

  /** The title. */
  protected final String        title;

  /** The attendees IDs. */
  //protected final Set<String>   attendees      = new LinkedHashSet<>();

  /** The participant IDs. For internal use. */
  protected final Set<String>   participantIds = new LinkedHashSet<>();

  /** The participants. */
  protected final Set<UserInfo> participants   = new LinkedHashSet<>();

  /** The owner. */
  protected final IdentityInfo  owner;

  /** The owner type. */
  protected final String        ownerType;

  /** The owner link. */
  protected final String        ownerLink;

  /** The avatar link. */
  protected final String        avatarLink;

  /** The provider type. */
  protected final String        providerType;

  /** The state. */
  protected String              state;

  /**
   * Instantiates a new call info.
   *
   * @param id the id
   * @param title the title
   * @param owner the owner
   * @param ownerType the owner type
   * @param ownerLink the owner link
   * @param avatarLink the avatar link
   * @param providerType the provider type
   */
  public CallInfo(String id,
                  String title,
                  IdentityInfo owner,
                  String ownerType,
                  String ownerLink,
                  String avatarLink,
                  String providerType) {
    super();
    this.id = id;
    this.title = title;
    this.owner = owner;
    this.ownerType = ownerType;
    this.ownerLink = ownerLink;
    this.avatarLink = avatarLink;
    this.providerType = providerType;
  }

  /**
   * Gets the id.
   *
   * @return the id
   */
  public String getId() {
    return id;
  }

  /**
   * Gets the title.
   *
   * @return the title
   */
  public String getTitle() {
    return title;
  }

  /**
   * Gets the participants (users planned for the call).
   *
   * @return the participants
   */
  public Set<UserInfo> getParticipants() {
    return Collections.unmodifiableSet(participants);
  }

  /**
   * Checks if it is a participant (by user ID).
   *
   * @param partId the part id
   * @return true, if is participant
   */
  public boolean isParticipant(String partId) {
    return participantIds.contains(partId);
  }

  // TODO cleanup
//  /**
//   * Gets the attendees IDs (users already joined the call).
//   *
//   * @return the attendees IDs
//   */
//  public Set<String> getAttendees() {
//    return Collections.unmodifiableSet(attendees);
//  }
//
//  /**
//   * Checks if a given participant ID is an attendee of started or paused call. Note that a stopped call has
//   * no attendees.
//   *
//   * @param partId the part id
//   * @return true, if is attendee of started or paused call, false otherwise
//   */
//  public boolean isAttendee(String partId) {
//    if (CallState.STARTED.equals(state) || CallState.PAUSED.equals(state)) {
//      return participantIds.contains(partId) && attendees.contains(partId);
//    } else {
//      return false;
//    }
//  }

  /**
   * Gets the owner.
   *
   * @return the owner
   */
  public IdentityInfo getOwner() {
    return owner;
  }

  /**
   * Gets the owner type.
   *
   * @return the owner type
   */
  public String getOwnerType() {
    return ownerType;
  }

  /**
   * Gets the owner link.
   *
   * @return the owner link
   */
  public String getOwnerLink() {
    return ownerLink;
  }

  /**
   * Gets the avatar link.
   *
   * @return the avatar link
   */
  public String getAvatarLink() {
    return avatarLink;
  }

  /**
   * Gets the provider type.
   *
   * @return the provider type
   */
  public String getProviderType() {
    return providerType;
  }

  /**
   * Adds the participants.
   *
   * @param parts the parts
   */
  public void addParticipants(Collection<UserInfo> parts) {
    for (UserInfo part : parts) {
      addParticipant(part);
    }
  }

  /**
   * Adds the participant.
   *
   * @param part the part
   */
  public void addParticipant(UserInfo part) {
    this.participants.add(part);
    this.participantIds.add(part.getId());
  }

  /**
   * Gets the state.
   *
   * @return the state
   */
  public String getState() {
    return state;
  }

  /**
   * Sets the state.
   *
   * @param state the new state
   */
  public void setState(String state) {
    this.state = state;
    // TODO
//    if (CallState.STOPPED.equals(state)) {
//      this.attendees.clear();
//    }
  }

  // ******* Internals *******

  // TODO cleanup
  
//  /**
//   * Adds the attendee ID.
//   *
//   * @param partId the part id
//   * @return true, if successful, false if participant already added
//   * @throws ParticipantNotFound if given ID isn't in participants of this call
//   * @throws InvalidCallStateException if call not started
//   */
//  boolean addAttendee(String partId) throws ParticipantNotFound, InvalidCallStateException {
//    if (CallState.STARTED.equals(state) || CallState.PAUSED.equals(state)) {
//      if (participantIds.contains(partId)) {
//        return this.attendees.add(partId);
//      } else {
//        throw new ParticipantNotFound("Not a participant: " + partId);
//      }
//    } else {
//      throw new InvalidCallStateException("Call not started");
//    }
//  }
//
//  /**
//   * Removes the attendee by ID.
//   *
//   * @param partId the part id
//   * @return true, if successful, false if participant not yet attended
//   * @throws ParticipantNotFound if given ID isn't in participants of this call
//   * @throws InvalidCallStateException if call not started
//   */
//  boolean removeAttendee(String partId) throws ParticipantNotFound, InvalidCallStateException {
//    if (CallState.STARTED.equals(state) || CallState.PAUSED.equals(state)) {
//      if (participantIds.contains(partId)) {
//        return this.attendees.remove(partId);
//      } else {
//        throw new ParticipantNotFound("Not a participant: " + partId);
//      }
//    } else {
//      throw new InvalidCallStateException("Call not started");
//    }
//  }

}
